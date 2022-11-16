import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
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
    constructor(private readonly userService: UserService) {}

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
        this.userService.updateUser(user.socketId, { lobbyId });
        return lobby.users;
    }

    leaveLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.users = lobby.users.filter((iUser) => iUser.socketId !== user.socketId);
        this.userService.updateUser(user.socketId, { lobbyId: undefined });
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
}
