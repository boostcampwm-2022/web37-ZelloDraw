import { Injectable } from '@nestjs/common';

import { User } from './user.model';

@Injectable()
export class UserService {
    // TODO: 고민해보고 Map으로 변경할지 확인
    store: { [key: string]: User } = {};

    validateUser(socketId: string): void {
        if (this.store[socketId] === undefined) {
            throw Error('User is not exists');
        }
    }

    getUser(socketId: string): User {
        this.validateUser(socketId);
        return this.store[socketId];
    }

    createUser(socketId: string, name: string): User {
        const user = new User(socketId, name);
        this.store[socketId] = user;
        return user;
    }

    deleteUser(socketId: string): void {
        this.validateUser(socketId);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.store[socketId];
    }
}
