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
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { JoinLobbyRequest, CreateLobbyRequest } from './user.dto';
import { UserService } from './user.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway(8180, { namespace: 'core' })
export class CoreGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly lobbyService: LobbyService,
        private readonly userService: UserService,
    ) {}

    handleDisconnect(client: any) {
        console.log('disconnect');
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('connect');
    }

    afterInit(server: any) {
        console.log('afterInit');
    }

    @SubscribeMessage('create-lobby')
    // TODO: return type WsResponse 로 바꿔야함. + 학습 필요.
    async handleCreateLobby(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: CreateLobbyRequest,
    ) {
        // TODO: socket connection 라이프 사이클에 user 생성, 삭제 로직 할당
        const user = this.userService.createUser(body.userName, client.id);
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
        const user = this.userService.createUser(client.id, body.userName);

        await this.lobbyService.joinLobby(user, lobby.id);
        await client.join(body.lobbyId);
        // TODO: 현재 클라이언트 이름 없이 socket 정보만 관리하고 있음. 나중에 클라이언트 정보 정해지면, 클라이언트 정보로 변경 필요
        client.broadcast.to(lobby.id).emit('join-lobby', client);
        return lobby.users;
    }

    @SubscribeMessage('leave-lobby')
    async handleLeaveLobby(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        this.lobbyService.validateLobby(lobbyId);
        this.userService.validateUser(client.id);

        const user = this.userService.getUser(client.id);
        await this.lobbyService.leaveLobby(user, lobbyId);
        await client.leave(lobbyId);
        // TODO: 현재 클라이언트 이름 없이 socket 정보만 관리하고 있음. 나중에 클라이언트 정보 정해지면, 클라이언트 정보로 변경 필요
        client.broadcast.to(lobbyId).emit('leave-lobby', client.id);
        return null;
    }

    @SubscribeMessage('game-start')
    async handleGameStart(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const user = this.userService.getUser(client.id);

        if (this.lobbyService.isLobbyOwner(user, lobbyId))
            throw new Error('Only owner can start game');
        // TODO: GameStart 로직 처리 (게임 시작시 게임의 상태 정보 변경)
        // TODO: gameMock 데이터 대신 실제 게임 데이터로 변경 필요
        const lobby = this.lobbyService.getLobby(lobbyId);
        const gameMock = {
            id: lobbyId,
            players: lobby.users,
        };
        client.nsp.to(lobbyId).emit('game-start', gameMock);
    }
}
