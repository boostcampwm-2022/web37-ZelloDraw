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
import { RoundService } from './round.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { JoinLobbyRequest, JoinLobbyResponse, JoinLobbyReEmitRequest } from './user.dto';
import { UserService } from './user.service';
import { Round } from './round.model';
import { StartRoundResponse } from './round.dto';

// TODO: Validation Pipe 관련 내용 학습 + 소켓에서 에러 처리 어케할건지 학습 하고 적용하기
// @UsePipes(new ValidationPipe())
@WebSocketGateway(8180, { namespace: 'core' })
export class CoreGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly lobbyService: LobbyService,
        private readonly userService: UserService,
        private readonly roundService: RoundService,
    ) {}

    handleConnection(client: any) {
        this.userService.createUser(client.id, 'noname');
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        await this.handleLeaveLobby(client);
        this.userService.deleteUser(client.id);
    }

    afterInit(server: any) {
        console.log(server);
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
        const lobby = this.lobbyService.getLobby(body.lobbyId);
        // TODO: socket connection 라이프 사이클에 user 생성, 삭제 로직 할당
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
        console.log('start-game');
        const user = this.userService.getUser(client.id);

        if (!this.lobbyService.isLobbyHost(user, lobbyId)) {
            throw new Error('Only host can start game');
        }
        // TODO: GameStart 로직 처리 (게임 시작시 게임의 상태 정보 변경)
        // TODO: gameMock 데이터 대신 실제 게임 데이터로 변경 필요
        const lobby = this.lobbyService.getLobby(lobbyId);
        lobby.isPlaying = true;

        const gameMock = {
            lobbyId,
            users: lobby.host,
        };
        client.nsp.to(lobbyId).emit('start-game', gameMock);
    }

    @SubscribeMessage('start-round')
    async handleStartRound(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const user = this.userService.getUser(client.id);

        if (!this.lobbyService.isLobbyHost(user, lobbyId)) {
            throw new Error('Only host can start game');
        }

        const lobby = this.lobbyService.getLobby(lobbyId);
        if (!lobby.isPlaying) throw new Error('게임중이 아닙니다.');

        if (!lobby.isPlaying) {
            throw new Error('게임중이 아닙니다.');
        }

        const round: StartRoundResponse[] = [];
        lobby.users.forEach((user) => {
            const userRound = this.roundService.startRound(lobby);
            round.push(userRound);

            client.nsp.to(user.socketId).emit('start-round', userRound);
        });

        lobby.rounds.push(new Round(round));

        setTimeout(() => {
            console.log('발송');
            client.nsp.to(lobbyId).emit('complete-round', { round: lobby.rounds.length, lobbyId });
        }, 6000);
        return null;
    }
}
