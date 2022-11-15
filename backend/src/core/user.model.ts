import { IsNotEmpty } from 'class-validator';

export class User {
    @IsNotEmpty()
    socketId: string;

    @IsNotEmpty()
    name: string;

    constructor(socketId: string, name: string) {
        this.socketId = socketId;
        this.name = name;
    }
}
