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

const lobbyStore = {};

@WebSocketGateway(8180, { namespace: 'core' })
export class CoreGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    handleDisconnect(client: any) {
        console.log('disconnect');
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('connect');
    }

    afterInit(server: any) {
        console.log('afterInit');
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        return 'Hello world!';
    }

    @SubscribeMessage('create-lobby')
    handleCreateLobby(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const lobbyId = stringToInteger(new Date().toString());
        const newLobby = {
            id: lobbyId,
            owner: client,
        };
        lobbyStore[lobbyId] = newLobby;
        return newLobby;
    }
}

function stringToInteger(str) {
    let hash = 0;
    let i;
    let chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
