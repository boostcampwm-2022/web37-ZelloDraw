/* eslint-disable prettier/prettier */
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
import { InjectQueue, Processor } from '@nestjs/bull';
import { Queue } from 'bull';

// TODO: Validation Pipe 관련 내용 학습 + 소켓에서 에러 처리 어케할건지 학습 하고 적용하기
// @UsePipes(new ValidationPipe())
@UseFilters(new SocketExceptionFilter())
@Processor('core')
@WebSocketGateway(8180, { namespace: 'core' })
export class CoreGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectQueue('core') private readonly coreQueue: Queue,
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

            if (await this.gameService.isPlaying(body.lobbyId))
                throw new Error('이미 진행중인 게임입니다.');

            const users: User[] = await this.lobbyService.joinLobby(user, lobby.id);
            await client.join(body.lobbyId);
            this.emitJoinLobby(lobby.id, {
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

        await this.handleHostLeave(user);
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

        await this.handleHostLeave(user);
        await this.gameService.leaveWhenPlayingGame(user, user.lobbyId);
        this.emitLeaveGame(user.lobbyId, user);
        await client.leave(user.lobbyId);
    }

    async handleHostLeave(user: User) {
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
        this.server.to(user.lobbyId).emit('succeed-host', payload);
    }

    @SubscribeMessage('start-game')
    async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const user = await this.userService.getUser(client.id);
        if (!(await this.lobbyService.isLobbyHost(user, lobbyId)))
            throw new Error('Only host can start game');

        await this.gameService.startGame(lobbyId);

        this.emitStartGame(lobbyId);
        await this.emitStartRound(lobbyId);
    }

    @SubscribeMessage('submit-quiz-reply')
    async handleSubmitQuizReply(
        @ConnectedSocket() client: Socket,
        @MessageBody() request: SubmitQuizReplyRequest,
    ) {
        const user = await this.userService.getUser(client.id);
        await this.coreQueue.add('submit-quiz-reply', {
            user,
            request,
        });
    }

    broadCastQuizReplySubmitted(repliesCount: number, user: User) {
        const payload = new SubmitQuizReplyEmitRequest(repliesCount);
        this.emitSubmitQuizReply(user.lobbyId, payload);
    }

    async proceedRound(user: User) {
        if (await this.gameService.isLastRound(user.lobbyId)) {
            const game = await this.gameService.getGame(user.lobbyId);
            const resultShareId = await this.gameResultService.create(game);
            await this.emitCompleteGame(user.lobbyId, resultShareId);
        } else {
            await this.gameService.proceedRound(user.lobbyId);
            await this.emitStartRound(user.lobbyId);
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
        this.emitWatchResultSketchbook(user.lobbyId, payload.bookIdx, isWatched);
    }

    @SubscribeMessage('back-to-lobby')
    async onPlayNextGame(@ConnectedSocket() client: Socket) {
        const user = await this.userService.getUser(client.id);
        await this.gameService.quitGame(user.lobbyId);

        this.emitBackToLobby(user.lobbyId);
    }

    private emitWatchResultSketchbook(lobbyId: string, bookIndex: number, isWatched: boolean) {
        const payload = new WatchResultSketchbookEmitRequest(bookIndex, isWatched);
        this.server.to(lobbyId).emit('watch-result-sketchbook', payload);
    }

    private emitJoinLobby(lobbyId: string, payload: JoinLobbyReEmitRequest) {
        this.server.to(lobbyId).emit('join-lobby', payload);
    }

    private emitLeaveLobby(lobbyId: string, payload: JoinLobbyReEmitRequest[]) {
        this.server.to(lobbyId).emit('leave-lobby', payload);
    }

    private emitStartGame(lobbyId: string) {
        this.server.to(lobbyId).emit('start-game');
    }

    private async emitStartRound(lobbyId: string) {
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
            this.server.to(user.socketId).emit('start-round', payload);
        }
        await this.emitRoundTimeout(lobbyId);
    }

    private async emitRoundTimeout(lobbyId: string) {
        const game = await this.gameService.getGame(lobbyId);
        const roundWhenTimerStart = game.getCurRound();
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            try {
                if ((await this.gameService.getCurRound(lobbyId)) !== roundWhenTimerStart) return;
                (await this.gameService.getNotSubmittedUsers(lobbyId)).forEach((user, index) => {
                    // TODO: 동시성 이슈 해결하여 timeout 걷어내기
                    // setTimeout(() => {
                    this.server.to(user.socketId).emit('round-timeout');
                    // }, index * 100);
                });
            } catch (e) {
                console.log('종료된 게임입니다.');
            }
        }, game.getRoundLimitTime() * 1000);
    }

    private emitSubmitQuizReply(lobbyId: string, payload: SubmitQuizReplyEmitRequest) {
        this.server.to(lobbyId).emit('submit-quiz-reply', payload);
    }

    private async emitCompleteGame(lobbyId: string, gameResultId: string) {
        const quizReplyChains: QuizReplyChain[] =
            await this.gameService.getQuizReplyChainsWhenGameEnd(lobbyId);
        const payload = new CompleteGameEmitRequest(
            gameResultId,
            quizReplyChains.map((quizReplyChain) => quizReplyChain.quizReplyList),
        );

        this.server.to(lobbyId).emit('complete-game', payload);
    }

    private emitLeaveGame(lobbyId: string, user: User) {
        // TODO: EmitLeaveGameRequest 생성자 파라미터 순서 수정
        const payload = new EmitLeaveGameRequest(user.name, user.socketId);
        this.server.to(lobbyId).emit('leave-game', payload);
    }

    private emitBackToLobby(lobbyId: string) {
        this.server.to(lobbyId).emit('back-to-lobby');
    }
}
