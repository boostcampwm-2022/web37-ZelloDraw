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
        const lobby = this.getLobby(lobbyId);
        lobby.players.push(client.id);
        return lobby.players;
    }

    async leaveLobby(client: Socket, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.players = lobby.players.filter((player) => player !== client.id);
        return lobby.players;
    }

    validateLobby(lobbyId: string): void {
        if (this.store[lobbyId] === undefined) {
            throw Error('Lobby is not exists');
        }
    }

    isLobbyOwner(client: Socket, lobbyId: string): boolean {
        const lobby = this.getLobby(lobbyId);
        return lobby.owner === client.id;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        this.validateLobby(lobbyId);
        return this.store[lobbyId];
    }
}
