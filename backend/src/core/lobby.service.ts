import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class LobbyService {
    store = {};

    createLobby(client: Socket): string {
        const lobbyId = client.id + new Date().toString();
        this.store[lobbyId] = {
            id: lobbyId,
            owner: client,
        };
        return lobbyId;
    }
}
