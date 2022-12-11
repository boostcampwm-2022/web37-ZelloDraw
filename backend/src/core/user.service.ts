import { Injectable } from '@nestjs/common';

import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    // TODO: 고민해보고 Map으로 변경할지 확인
    constructor(private readonly userRepository: UserRepository) {}

    async validateUser(socketId: string): Promise<void> {
        if ((await this.userRepository.findById(socketId)) === undefined) {
            throw Error('User is not exists');
        }
    }

    async getUser(socketId: string): Promise<User> {
        await this.validateUser(socketId);
        return await this.userRepository.findById(socketId);
    }

    async createUser(socketId: string, name: string): Promise<string> {
        const userId = await this.userRepository.create(socketId, name);
        return userId;
    }

    async deleteUser(socketId: string): Promise<void> {
        await this.validateUser(socketId);
        await this.userRepository.delete(socketId);
    }

    async updateUser(socketId: string, param: Partial<User>) {
        const user = await this.getUser(socketId);
        for (const key in param) {
            user[key] = param[key];
        }
        await this.userRepository.save(user);
    }
}
