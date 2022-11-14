/* eslint-disable prettier/prettier */
import {
    ConnectedSocket,
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
}
