import { IsNotEmpty } from 'class-validator';
import { PartialWithoutMethods } from '../utils/types';

export class User {
    @IsNotEmpty()
    socketId: string;

    name: string;

    lobbyId: string | undefined;

    video: boolean;

    audio: boolean;

    constructor(socketId: string, name: string) {
        this.socketId = socketId;
        this.name = name;
    }

    getId() {
        return this.socketId;
    }

    static createByJson(json: PartialWithoutMethods<User>): User {
        const user = Object.assign(new User(json.socketId, json.name), json);
        return user;
    }
}
