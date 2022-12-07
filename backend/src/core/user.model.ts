import { IsNotEmpty } from 'class-validator';

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
}
