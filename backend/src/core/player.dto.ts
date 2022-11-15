import { IsNotEmpty } from 'class-validator';

export class Player {
    @IsNotEmpty()
    socketId: string;

    @IsNotEmpty()
    name: string;

    constructor(socketId: string, name: string) {
        this.socketId = socketId;
        this.name = name;
    }
}
