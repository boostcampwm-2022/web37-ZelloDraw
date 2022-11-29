import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GameLobby } from './gameLobby.model';
import { User } from './user.model';

@Injectable()
export class GameLobbyRepository {
    constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

    async create(user: User): Promise<string> {
        const gameLobby = new GameLobby(user);
        await this.save(gameLobby);
        return gameLobby.getId();
    }

    async delete(gameLobby: GameLobby) {
        await this.redis.del(gameLobby.getId());
    }

    async findById(lobbyId: string): Promise<GameLobby> {
        const gameLobby: string = await this.redis.get(lobbyId);
        return this.jsonToGameLobby(gameLobby);
    }

    async save(gameLobby: GameLobby) {
        await this.redis.set(gameLobby.getId(), this.gameLobbyToJson(gameLobby));
    }

    private jsonToGameLobby(json: string): GameLobby {
        const obj = JSON.parse(json);
        return GameLobby.createByJson(obj);
    }

    private gameLobbyToJson(gameLobby: GameLobby): string {
        return JSON.stringify(gameLobby);
    }
}
