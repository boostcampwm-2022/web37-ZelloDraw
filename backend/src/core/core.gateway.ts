/* eslint-disable prettier/prettier */
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

const lobbyList = {};

@WebSocketGateway()
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
        const lobbyKey = stringToInteger(new Date().toString());
        const lobbyInfo = {
            owner: client,
            key: lobbyKey,
        };
        lobbyList[lobbyKey] = lobbyInfo;
        console.log(lobbyList);
        return lobbyInfo;
    }
}

function stringToInteger(str) {
    var hash = 0,
        i,
        chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
