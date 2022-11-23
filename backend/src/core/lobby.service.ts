import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { GameLobby } from './gameLobby.model';
import { GameLobbyRepository } from './gamelobby.repository';

@Injectable()
export class LobbyService {
    constructor(
        private readonly userService: UserService,
        private readonly gameLobbyRepository: GameLobbyRepository,
    ) {}

    createLobby(user: User): string {
        return this.gameLobbyRepository.create(user);
    }

    async joinLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        // TODO: Define 파일을 통해 상수 관리하기
        if (lobby.users.length >= 8) {
            throw Error('초대받은 방이 꽉 차버렸네요!');
        }
        lobby.joinLobby(user);
        this.userService.updateUser(user.socketId, { lobbyId });
        this.gameLobbyRepository.save(lobby);
        return lobby.getUsers();
    }

    leaveLobby(user: User, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.leaveLobby(user);
        this.userService.updateUser(user.socketId, { lobbyId: undefined });
        this.gameLobbyRepository.save(lobby);
        return lobby.getUsers();
    }

    validateLobby(lobbyId: string): void {
        const gameLobby = this.gameLobbyRepository.findById(lobbyId);
        if (gameLobby === undefined) {
            throw Error('Lobby is not exists');
        }
    }

    isLobbyHost(user: User, lobbyId: string): boolean {
        const lobby = this.getLobby(lobbyId);
        return lobby.getHost().socketId === user.socketId;
    }

    getLobby(lobbyId: string): GameLobby | undefined {
        this.validateLobby(lobbyId);
        return this.gameLobbyRepository.findById(lobbyId);
    }
}
