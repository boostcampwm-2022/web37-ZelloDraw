import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { Round } from './round.model';

export interface LobbyStore {
    [key: string]: Lobby;
}

export interface Lobby {
    id: string;
    host: User;
    users: User[];
    isPlaying: boolean;
    rounds: Round[];
}
@Injectable()
export class LobbyService {
    store: LobbyStore = {};

    createLobby(user: User): string {
        const lobbyId = `${user.socketId}${new Date().getTime()}`;
        this.store[lobbyId] = {
            id: lobbyId,
            host: user,
            users: [],
            isPlaying: false,
            rounds: [],
        };
        return lobbyId;
    }

    async joinLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.users.push(user);
        return lobby.users;
    }

    async leaveLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.users = lobby.users.filter((iUser) => iUser.socketId !== user.socketId);
        return lobby.users;
    }

    validateLobby(lobbyId: string): void {
        if (this.store[lobbyId] === undefined) {
            throw Error('Lobby is not exists');
        }
    }

    isLobbyHost(user: User, lobbyId: string): boolean {
        const lobby = this.getLobby(lobbyId);
        return lobby.host.socketId === user.socketId;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        this.validateLobby(lobbyId);
        return this.store[lobbyId];
    }

    getRandomWord(): string {
        return this.getRandomInt(100);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max).toString();
    }
}
