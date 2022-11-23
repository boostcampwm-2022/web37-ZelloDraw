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
    StartRoundEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
} from './game.dto';

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
        await this.handleLeaveLobby(client);
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
        const lobbyId = this.lobbyService.createLobby(user);
        await client.join(lobbyId);
        return lobbyId;
    }

    @SubscribeMessage('join-lobby')
    async handleJoinLobby(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: JoinLobbyRequest,
    ) {
        try {
            const lobby = this.lobbyService.getLobby(body.lobbyId);
            const user = this.userService.getUser(client.id);

            await this.lobbyService.joinLobby(user, lobby.id);
            await client.join(body.lobbyId);
            client
                .to(lobby.id)
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                .emit('join-lobby', { userName: user.name } as JoinLobbyReEmitRequest);

            return lobby.users.map((user) => {
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

        const leftUsers = this.lobbyService.leaveLobby(user, user.lobbyId);
        client.broadcast
            .to(user.lobbyId)
            .emit(
                'leave-lobby',
                leftUsers.map((user) => ({ userName: user.name })) as JoinLobbyResponse,
            );
        await client.leave(user.lobbyId);
    }

    @SubscribeMessage('start-game')
    async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const user = this.userService.getUser(client.id);
        if (!this.lobbyService.isLobbyHost(user, lobbyId))
            throw new Error('Only host can start game');

        const game = this.gameService.getGame(lobbyId);
        this.gameService.startGame(lobbyId);

        client.nsp.to(lobbyId).emit('start-game');
        this.emitStartRound(client, lobbyId);
    }

    @SubscribeMessage('submit-quiz-reply')
    async handleSubmitQuizReply(
        @ConnectedSocket() client: Socket,
        @MessageBody() request: SubmitQuizReplyRequest,
    ) {
        const user = this.userService.getUser(client.id);
        // TODO: 모든 인원이 제출 | 시간 초과 시 라운드 넘어가는 로직 추가 필요
        this.gameService.submitQuizReply(user.lobbyId, user, request.quizReply);

        const payload: SubmitQuizReplyEmitRequest = {
            submittedQuizReplyCount: this.gameService.getSubmittedQuizRepliesCount(user.lobbyId),
        };
        client.nsp.to(user.lobbyId).emit('submit-quiz-reply', payload);
    }

    emitStartRound(client: Socket, lobbyId: string) {
        const game = this.gameService.getGame(lobbyId);
        game.getUsers().forEach((user) => {
            const quizReply = this.gameService
                .getCurrentRoundQuizReplyChain(lobbyId, user)
                .getLastQuizReply();
            const payload: StartRoundEmitRequest = {
                quizReply,
                curRound: game.curRound,
                maxRound: game.maxRound,
                limitTime: game.roundLimitTime,
            };
            client.nsp.to(user.socketId).emit('start-round', payload);
        });
    }
}
