import { Injectable } from '@nestjs/common';
import { GameLobby } from './gameLobby.model';
import { User } from './user.model';

@Injectable()
export class GameLobbyRepository {
    gameLobbyStore: { [key: string]: GameLobby };

    constructor() {
        this.gameLobbyStore = {};
    }

    create(user: User): string {
        const gameLobby = new GameLobby(user);
        this.gameLobbyStore[gameLobby.getId()] = gameLobby;
        return gameLobby.getId();
    }

    delete(gameLobby: GameLobby) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.gameLobbyStore[gameLobby.getId()];
    }

    findByUser(user: User): GameLobby {
        return this.gameLobbyStore[user.lobbyId];
    }

    findById(lobbyId: string): GameLobby {
        return this.gameLobbyStore[lobbyId];
    }

    save(gameLobby: GameLobby) {
        this.gameLobbyStore[gameLobby.getId()] = gameLobby;
    }
}
