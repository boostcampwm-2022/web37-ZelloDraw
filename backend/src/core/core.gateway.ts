/* eslint-disable prettier/prettier */
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LobbyService } from './lobby.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    JoinLobbyRequest,
    JoinLobbyResponse,
    JoinLobbyReEmitRequest,
    EmitLeaveGameRequest,
    SucceedHostEmitRequest,
} from './user.dto';
import { UserService } from './user.service';
import { SocketException } from './socket.exception';
import { SocketExceptionFilter } from './socket.filter';
import { GameService } from './game.service';
import { GameResultService } from '../gameResult/gameResult.service';
import {
    CompleteGameEmitRequest,
    StartRoundEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
    WatchResultSketchbookEmitRequest,
    WatchResultSketchbookRequest,
} from './game.dto';
import { QuizReplyChain } from './quizReplyChain.model';
import { User } from './user.model';

// TODO: Validation Pipe 관련 내용 학습 + 소켓에서 에러 처리 어케할건지 학습 하고 적용하기
// @UsePipes(new ValidationPipe())
@UseFilters(new SocketExceptionFilter())
@WebSocketGateway(8180, { namespace: 'core' })
export class CoreGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly lobbyService: LobbyService,
        private readonly gameService: GameService,
        private readonly userService: UserService,
        private readonly gameResultService: GameResultService,
    ) {}

    async handleConnection(client: any) {
        await this.userService.createUser(client.id, 'noname');
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        const user = await this.userService.getUser(client.id);

        if (user.lobbyId) {
            const gameLobby = await this.gameService.getGame(user.lobbyId);
            if (gameLobby.getIsPlaying()) {
                await this.handleLeaveGame(client);
            } else {
                await this.handleLeaveLobby(client);
            }
        }
        await this.userService.deleteUser(client.id);
    }

    @SubscribeMessage('update-user-name')
    async handleCreateUser(@ConnectedSocket() client: Socket, @MessageBody() userName: string) {
        return await this.userService.updateUser(client.id, { name: userName });
    }

    @SubscribeMessage('create-lobby')
    // TODO: return type WsResponse 로 바꿔야함. + 학습 필요.
    async handleCreateLobby(@ConnectedSocket() client: Socket) {
        // TODO: socket connection 라이프 사이클에 user 생성, 삭제 로직 할당
        const user = await this.userService.getUser(client.id);
        console.log('user: ', user);
        const lobbyId = await this.lobbyService.createLobby(user);
        await client.join(lobbyId);
        return lobbyId;
    }

    @SubscribeMessage('join-lobby')
    async handleJoinLobby(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: JoinLobbyRequest,
    ) {
        try {
            const lobby = await this.lobbyService.getLobby(body.lobbyId);
            const host = await this.lobbyService.getHost(lobby.id);
            const user = await this.userService.getUser(client.id);

            const users: User[] = await this.lobbyService.joinLobby(user, lobby.id);
            await client.join(body.lobbyId);
            this.emitJoinLobby(client, lobby.id, {
                userName: user.name,
                sid: client.id,
                audio: user.audio,
                video: user.video,
            });

            return users.map((user) => {
                return {
                    userName: user.name,
                    sid: user.socketId,
                    video: user.video,
                    audio: user.audio,
                    isHost: user.getId() === host.getId(),
                };
            }) as JoinLobbyResponse;
        } catch (e) {
            throw new SocketException('BadRequest', e.message);
        }
    }

    @SubscribeMessage('leave-lobby')
    async handleLeaveLobby(@ConnectedSocket() client: Socket) {
        const user = await this.userService.getUser(client.id);
        if (user.lobbyId === undefined) return;

        await this.handleHostLeave(client, user);
        await this.lobbyService.leaveLobby(user, user.lobbyId);
        const payload = {
            userName: user.name,
            sid: user.socketId,
        };
        client.broadcast.to(user.lobbyId).emit('leave-lobby', payload);
        await client.leave(user.lobbyId);
    }

    @SubscribeMessage('leave-game')
    async handleLeaveGame(@ConnectedSocket() client: Socket) {
        const user = await this.userService.getUser(client.id);
        if (user.lobbyId === undefined) return;

        await this.handleHostLeave(client, user);
        await this.gameService.leaveWhenPlayingGame(user, user.lobbyId);
        this.emitLeaveGame(client, user);
        await client.leave(user.lobbyId);
    }

    async handleHostLeave(client: Socket, user: User) {
        const isGameHost = await this.gameService.isHost(user.lobbyId, user);
        if (!isGameHost) return;
        const numOfUsersInLobby = await this.lobbyService.getNumOfUsers(user.lobbyId);
        if (numOfUsersInLobby <= 1) return;

        await this.gameService.succeedHost(user.lobbyId);
        const hostUser = await this.gameService.getGameHost(user.lobbyId);
        const payload: SucceedHostEmitRequest = {
            userName: hostUser.name,
            sid: hostUser.getId(),
        };
        client.to(user.lobbyId).emit('succeed-host', payload);
    }

    @SubscribeMessage('start-game')
    async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const user = await this.userService.getUser(client.id);
        if (!(await this.lobbyService.isLobbyHost(user, lobbyId)))
            throw new Error('Only host can start game');

        await this.gameService.startGame(lobbyId);

        this.emitStartGame(client, lobbyId);
        await this.emitStartRound(client, lobbyId);
    }

    @SubscribeMessage('submit-quiz-reply')
    async handleSubmitQuizReply(
        @ConnectedSocket() client: Socket,
        @MessageBody() request: SubmitQuizReplyRequest,
    ) {
        const user = await this.userService.getUser(client.id);
        // TODO: 시간 초과 시 라운드 넘어가는 로직 추가 필요
        await this.gameService.submitQuizReply(user.lobbyId, user, request.quizReply);
        const repliesCount = await this.gameService.getSubmittedQuizRepliesCount(user.lobbyId);
        if (await this.gameService.isAllUserSubmittedQuizReply(user.lobbyId)) {
            await this.proceedRound(user, client);
        } else {
            this.broadCastQuizReplySubmitted(repliesCount, client, user);
        }
    }

    private broadCastQuizReplySubmitted(repliesCount: number, client: Socket, user: User) {
        const payload = new SubmitQuizReplyEmitRequest(repliesCount);
        this.emitSubmitQuizReply(client, user.lobbyId, payload);
    }

    private async proceedRound(user: User, client: Socket) {
        if (await this.gameService.isLastRound(user.lobbyId)) {
            const game = await this.gameService.getGame(user.lobbyId);
            const resultShareId = await this.gameResultService.create(game);
            await this.emitCompleteGame(client, user.lobbyId, resultShareId);
        } else {
            await this.gameService.proceedRound(user.lobbyId);
            await this.emitStartRound(client, user.lobbyId);
        }
    }

    @SubscribeMessage('webrtc-offer')
    async handleOffer(@ConnectedSocket() client: Socket, @MessageBody() body) {
        client.broadcast.to(body.offerReceiveID).emit('webrtc-offer', body.sdp, client.id);
    }

    @SubscribeMessage('webrtc-answer')
    async handleAnswer(@ConnectedSocket() client: Socket, @MessageBody() body) {
        const user = await this.userService.getUser(client.id);
        client.broadcast
            .to(body.answerReceiveID)
            .emit('webrtc-answer', body.sdp, client.id, user.name);
    }

    @SubscribeMessage('webrtc-ice')
    async handleIce(@ConnectedSocket() client: Socket, @MessageBody() body) {
        const user = await this.userService.getUser(client.id);
        client.broadcast
            .to(body.candidateReceiveID)
            .emit('webrtc-ice', body.ice, client.id, user.name);
    }

    @SubscribeMessage('update-user-stream')
    async handleChangeStream(@ConnectedSocket() client: Socket, @MessageBody() body) {
        const user = await this.userService.getUser(client.id);
        await this.userService.updateUser(client.id, { video: body.video, audio: body.audio });
        const payload = {
            socketId: user.socketId,
            video: body.video,
            audio: body.audio,
        };
        client.to(user.lobbyId).emit('update-user-stream', payload);
    }

    @SubscribeMessage('watch-result-sketchbook')
    async handleWatchResultSketchbook(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WatchResultSketchbookRequest,
    ) {
        const user = await this.userService.getUser(client.id);
        const isWatched: boolean = await this.gameService.getIsWatchedQuizReplyChain(
            user.lobbyId,
            payload.bookIdx,
        );
        await this.gameService.watchQuizReplyChain(user.lobbyId, payload.bookIdx);
        this.emitWatchResultSketchbook(client, payload.bookIdx, isWatched);
    }

    @SubscribeMessage('back-to-lobby')
    async onPlayNextGame(@ConnectedSocket() client: Socket) {
        const user = await this.userService.getUser(client.id);
        await this.gameService.quitGame(user.lobbyId);

        this.emitBackToLobby(client);
    }

    private emitWatchResultSketchbook(client: Socket, bookIndex: number, isWatched: boolean) {
        const payload = new WatchResultSketchbookEmitRequest(bookIndex, isWatched);
        client.nsp.emit('watch-result-sketchbook', payload);
    }

    private emitJoinLobby(client: Socket, lobbyId: string, payload: JoinLobbyReEmitRequest) {
        client.to(lobbyId).emit('join-lobby', payload);
    }

    private emitLeaveLobby(client: Socket, lobbyId: string, payload: JoinLobbyReEmitRequest[]) {
        client.broadcast.to(lobbyId).emit('leave-lobby', payload);
    }

    private emitStartGame(client: Socket, lobbyId: string) {
        client.nsp.to(lobbyId).emit('start-game');
    }

    private async emitStartRound(client: Socket, lobbyId: string) {
        const game = await this.gameService.getGame(lobbyId);
        for (const user of game.getUsers()) {
            const quizReply = (
                await this.gameService.getCurrentRoundQuizReplyChain(lobbyId, user)
            ).getLastQuizReply();

            const payload = new StartRoundEmitRequest(
                game.getRoundType(),
                quizReply,
                game.curRound,
                game.maxRound,
                game.roundLimitTime,
            );
            client.nsp.to(user.socketId).emit('start-round', payload);
        }
        await this.emitRoundTimeout(client, lobbyId);
    }

    private async emitRoundTimeout(client: Socket, lobbyId: string) {
        const game = await this.gameService.getGame(lobbyId);
        const roundWhenTimerStart = game.getCurRound();
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            try {
                if ((await this.gameService.getCurRound(lobbyId)) !== roundWhenTimerStart) return;
                (await this.gameService.getNotSubmittedUsers(lobbyId)).forEach((user, index) => {
                    // TODO: 동시성 이슈 해결하여 timeout 걷어내기
                    setTimeout(() => {
                        client.nsp.to(user.socketId).emit('round-timeout');
                    }, index * 100);
                });
            } catch (e) {
                console.log('종료된 게임입니다.');
            }
        }, game.getRoundLimitTime() * 1000);
    }

    private emitSubmitQuizReply(
        client: Socket,
        lobbyId: string,
        payload: SubmitQuizReplyEmitRequest,
    ) {
        client.nsp.to(lobbyId).emit('submit-quiz-reply', payload);
    }

    private async emitCompleteGame(client: Socket, lobbyId: string, gameResultId: string) {
        const quizReplyChains: QuizReplyChain[] =
            await this.gameService.getQuizReplyChainsWhenGameEnd(lobbyId);
        const payload = new CompleteGameEmitRequest(
            gameResultId,
            quizReplyChains.map((quizReplyChain) => quizReplyChain.quizReplyList),
        );

        client.nsp.to(lobbyId).emit('complete-game', payload);
    }

    private emitLeaveGame(client: Socket, user: User) {
        const payload = new EmitLeaveGameRequest(user.name, client.id);
        client.nsp.to(user.lobbyId).emit('leave-game', payload);
    }

    private emitBackToLobby(client: Socket) {
        client.nsp.emit('back-to-lobby');
    }
}
