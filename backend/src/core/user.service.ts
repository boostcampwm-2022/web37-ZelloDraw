import { Injectable } from '@nestjs/common';

import { Player } from './player.dto';

@Injectable()
export class UserService {
    // TODO: 고민해보고 Map으로 변경할지 확인
    store: { [key: string]: Player } = {};

    validateUser(socketId: string): void {
        if (this.store[socketId] === undefined) {
            throw Error('User is not exists');
        }
    }

    getUser(socketId: string): Player {
        this.validateUser(socketId);
        return this.store[socketId];
    }

    createUser(socketId: string, name: string): Player {
        const player = new Player(socketId, name);
        this.store[socketId] = player;
        return player;
    }

    deleteUser(socketId: string): void {
        this.validateUser(socketId);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.store[socketId];
    }
}
