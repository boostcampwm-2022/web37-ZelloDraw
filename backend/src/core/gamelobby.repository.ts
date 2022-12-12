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

    async updateUser(gameLobby: GameLobby, user: User) {
        gameLobby.updateUsers(user);
        await this.save(gameLobby);
    }

    async delete(gameLobby: GameLobby) {
        const key = this.toKey(gameLobby.getId());
        await this.redis.del(key);
    }

    async findById(lobbyId: string): Promise<GameLobby> {
        const key = this.toKey(lobbyId);
        const gameLobby: string = await this.redis.get(key);
        return this.jsonToGameLobby(gameLobby);
    }

    async save(gameLobby: GameLobby) {
        const key = this.toKey(gameLobby.getId());
        try {
            console.log('before', await this.findById(gameLobby.getId()));
        } catch {}
        await this.redis.set(key, this.gameLobbyToJson(gameLobby));
        try {
            console.log('after', await this.findById(gameLobby.getId()));
        } catch {}
    }

    private toKey(gameLobbyId: string): string {
        return `game-lobby:${gameLobbyId}`;
    }

    private jsonToGameLobby(json: string): GameLobby {
        const obj = JSON.parse(json);
        return GameLobby.createByJson(obj);
    }

    private gameLobbyToJson(gameLobby: GameLobby): string {
        return JSON.stringify(gameLobby);
    }
}
