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

@WebSocketGateway(8180, { namespace: 'core' })
export class CoreGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly lobbyService: LobbyService) {}

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
    async handleCreateLobby(@ConnectedSocket() client: Socket) {
        const lobbyId = this.lobbyService.createLobby(client);
        await client.join(lobbyId);
        return lobbyId;
    }

    @SubscribeMessage('join-lobby')
    async handleJoinLobby(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const lobby = this.lobbyService.getLobby(lobbyId);
        if (lobby === undefined) {
            // TODO: 소켓 클라이언트에게 에러 전달 방법(에러 핸들링) 확인 필요.
            throw new Error('Lobby not found');
        }
        await this.lobbyService.joinLobby(client, lobbyId);
        await client.join(lobbyId);
        // TODO: 현재 클라이언트 이름 없이 socket 정보만 관리하고 있음. 나중에 클라이언트 정보 정해지면, 클라이언트 정보로 변경 필요
        client.broadcast.to(lobbyId).emit('join-lobby', client);
        return lobby.players;
    }

    @SubscribeMessage('leave-lobby')
    async handleLeaveLobby(@ConnectedSocket() client: Socket, @MessageBody() lobbyId: string) {
        const lobby = this.lobbyService.getLobby(lobbyId);
        if (lobby === undefined) {
            // TODO: 소켓 클라이언트에게 에러 전달 방법(에러 핸들링) 확인 필요.
            throw new Error('Lobby not found');
        }
        await this.lobbyService.leaveLobby(client, lobbyId);
        await client.leave(lobbyId);
        // TODO: 현재 클라이언트 이름 없이 socket 정보만 관리하고 있음. 나중에 클라이언트 정보 정해지면, 클라이언트 정보로 변경 필요
        client.broadcast.to(lobbyId).emit('leave-lobby', client.id);
        return null;
    }
}
