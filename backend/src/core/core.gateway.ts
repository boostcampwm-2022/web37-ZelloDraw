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
import { JoinLobbyRequest, JoinLobbyResponse, JoinLobbyReEmitRequest } from './user.dto';
import { UserService } from './user.service';
import { SocketException } from './socket.exception';
import { SocketExceptionFilter } from './socket.filter';
import { GameService } from './game.service';
import {
    CompleteGameEmitRequest,
    StartRoundEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
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
    ) {}

    handleConnection(client: any) {
        this.userService.createUser(client.id, 'noname');
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        const user = this.userService.getUser(client.id);
        const gameLobby = await this.gameService.getGame(user.lobbyId);
        if (gameLobby.getIsPlaying()) {
            await this.handleLeaveGame(client);
        } else {
            await this.handleLeaveLobby(client);
        }
        this.userService.deleteUser(client.id);
    }

    afterInit(server: any) {
        console.log('afterInit');
    }

    @SubscribeMessage('update-user-name')
    async handleCreateUser(@ConnectedSocket() client: Socket, @MessageBody() userName: string) {
        return this.userService.updateUser(client.id, { name: userName });
    }

    @SubscribeMessage('create-lobby')
    // TODO: return type WsResponse 로 바꿔야함. + 학습 필요.
    async handleCreateLobby(@ConnectedSocket() client: Socket) {
        // TODO: socket connection 라이프 사이클에 user 생성, 삭제 로직 할당
        const user = this.userService.getUser(client.id);
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
            const user = this.userService.getUser(client.id);

            const users: User[] = await this.lobbyService.joinLobby(user, lobby.id);
            await client.join(body.lobbyId);
            this.emitJoinLobby(client, lobby.id, { userName: user.name });

            return users.map((user) => {
                return { userName: user.name };
            }) as JoinLobbyResponse;
        } catch (e) {
            throw new SocketException('BadRequest', e.message);
        }
    }

    @SubscribeMessage('leave-lobby')
    async handleLeaveLobby(@ConnectedSocket() client: Socket) {
        const user = this.userService.getUser(client.id);
        if (user.lobbyId === undefined) return;

        const leftUsers = await this.lobbyService.leaveLobby(user, user.lobbyId);
        const payload: JoinLobbyReEmitRequest[] = leftUsers.map((user) => ({
            userName: user.name,
        }));
        this.emitLeaveLobby(client, user.lobbyId, payload);
        await client.leave(user.lobbyId);
    }

    @SubscribeMessage('leave-game')
    async handleLeaveGame(@ConnectedSocket() client: Socket) {
        const user = this.userService.getUser(client.id);
        if (user.lobbyId === undefined) return;

        await this.gameService.leaveWhenPlayingGame(user, user.lobbyId);
        this.emitLeaveGame(client, user);
    }

    @SubscribeMessage('start-game')
    async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const user = this.userService.getUser(client.id);
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
        const user = this.userService.getUser(client.id);
        // TODO: 시간 초과 시 라운드 넘어가는 로직 추가 필요
        await this.gameService.submitQuizReply(user.lobbyId, user, request.quizReply);
        const repliesCount = await this.gameService.getSubmittedQuizRepliesCount(user.lobbyId);
        if (await this.gameService.isAllUserSubmittedQuizReply(user.lobbyId)) {
            if (await this.gameService.isLastRound(user.lobbyId)) {
                await this.emitCompleteGame(client, user.lobbyId);
            } else {
                await this.gameService.proceedRound(user.lobbyId);
                await this.emitStartRound(client, user.lobbyId);
            }
        } else {
            const payload: SubmitQuizReplyEmitRequest = {
                submittedQuizReplyCount: repliesCount,
            };
            this.emitSubmitQuizReply(client, user.lobbyId, payload);
        }
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
            const payload: StartRoundEmitRequest = {
                quizReply,
                roundType: game.getRoundType(),
                curRound: game.curRound,
                maxRound: game.maxRound,
                limitTime: game.roundLimitTime,
            };
            client.nsp.to(user.socketId).emit('start-round', payload);
        }
        await this.emitRoundTimeout(client, lobbyId);
    }

    private async emitRoundTimeout(client: Socket, lobbyId: string) {
        const game = await this.gameService.getGame(lobbyId);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            try {
                (await this.gameService.getNotSubmittedUsers(lobbyId)).forEach((user) => {
                    client.nsp.to(user.socketId).emit('round-timeout');
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

    private async emitCompleteGame(client: Socket, lobbyId: string) {
        const quizReplyChains: QuizReplyChain[] =
            await this.gameService.getQuizReplyChainsWhenGameEnd(lobbyId);
        const payload: CompleteGameEmitRequest = {
            quizReplyLists: quizReplyChains.map((quizReplyChain) => quizReplyChain.quizReplyList),
        };
        client.nsp.to(lobbyId).emit('complete-game', payload);
    }

    private emitLeaveGame(client: Socket, user: User) {
        const payload: JoinLobbyReEmitRequest = {
            userName: user.name,
        };
        client.nsp.to(user.socketId).emit('leave-game', payload);
    }
}
