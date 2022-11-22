import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { GameLobby } from './gameLobby.model';
import { Lobby } from './lobby.interface';

export interface LobbyStore {
    [key: string]: Lobby;
}

@Injectable()
export class LobbyService {
    constructor(private readonly userService: UserService) {}

    store: LobbyStore = {};

    createLobby(user: User): string {
        // TODO: LobbyService에서는 Lobby에만 의존하기로 함. 따라서 GameLobby 인스턴스화는 외부에서 하도록(Factory 패턴 이용)
        const lobby: Lobby = new GameLobby(user);
        this.store[lobby.getId()] = lobby;
        return lobby.getId();
    }

    async joinLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.joinLobby(user);
        this.userService.updateUser(user.socketId, { lobbyId });
        return lobby.getUsers();
    }

    leaveLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.leaveLobby(user);
        this.userService.updateUser(user.socketId, { lobbyId: undefined });
        return lobby.getUsers();
    }

    validateLobby(lobbyId: string): void {
        if (this.store[lobbyId] === undefined) {
            throw Error('Lobby is not exists');
        }
    }

    isLobbyHost(user: User, lobbyId: string): boolean {
        const lobby = this.getLobby(lobbyId);
        return lobby.getHost().socketId === user.socketId;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        this.validateLobby(lobbyId);
        return this.store[lobbyId];
    }
}
