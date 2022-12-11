import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from './user.model';

@Injectable()
export class UserRepository {
    constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

    async create(socketId: string, name: string): Promise<string> {
        const user = new User(socketId, name);
        await this.save(user);
        return user.getId();
    }

    async delete(userId: string) {
        const key = this.toKey(userId);
        await this.redis.del(key);
    }

    async findById(userId: string): Promise<User> {
        const key = this.toKey(userId);
        const user: string = await this.redis.get(key);
        return this.jsonToUser(user);
    }

    async save(user: User) {
        const key = this.toKey(user.getId());
        await this.redis.set(key, this.userToJson(user));
    }

    private toKey(userId: string): string {
        return `user:${userId}`;
    }

    private jsonToUser(json: string): User {
        const obj = JSON.parse(json);
        return User.createByJson(obj);
    }

    private userToJson(user: User): string {
        return JSON.stringify(user);
    }
}
