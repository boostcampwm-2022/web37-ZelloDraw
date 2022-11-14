import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

export interface LobbyStore {
    [key: string]: Lobby;
}

export interface Lobby {
    id: string;
    owner: Socket;
    players: Socket[];
}

@Injectable()
export class LobbyService {
    store: LobbyStore = {};

    createLobby(client: Socket): string {
        const lobbyId = client.id + new Date().toString();
        this.store[lobbyId] = {
            id: lobbyId,
            owner: client,
            players: [],
        };
        return lobbyId;
    }

    async joinLobby(client: Socket, lobbyId: string) {
        const lobby = this.store[lobbyId];
        if (lobby === undefined) {
            return new Error('Lobby not found');
        }
        lobby.players.push(client);
        return lobby.players;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        return this.store[lobbyId];
    }
}
