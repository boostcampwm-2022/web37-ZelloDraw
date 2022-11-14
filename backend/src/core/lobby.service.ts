import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

export interface LobbyStore {
    [key: string]: Lobby;
}

export interface Lobby {
    id: string;
    owner: string;
    players: string[];
}

@Injectable()
export class LobbyService {
    store: LobbyStore = {};

    createLobby(client: Socket): string {
        const lobbyId = `${client.id}${new Date().getTime()}`;
        this.store[lobbyId] = {
            id: lobbyId,
            owner: client.id,
            players: [],
        };
        return lobbyId;
    }

    async joinLobby(client: Socket, lobbyId: string) {
        const lobby = this.store[lobbyId];
        if (lobby === undefined) {
            return new Error('Lobby not found');
        }
        lobby.players.push(client.id);
        return lobby.players;
    }

    isLobbyOwner(client: Socket, lobbyId: string): boolean {
        const lobby = this.getLobby(lobbyId);
        if (lobby === undefined) {
            return false;
        }
        return lobby.owner === client.id;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        return this.store[lobbyId];
    }
}
