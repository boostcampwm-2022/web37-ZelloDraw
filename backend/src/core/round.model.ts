import { IsNotEmpty } from 'class-validator';

export class Round {
    @IsNotEmpty()
    round: number;

    @IsNotEmpty()
    lobbyId: string;

    @IsNotEmpty()
    startTime: Date;

    @IsNotEmpty()
    completeTime: Date;

    constructor(round: number, lobbyId: string, startTime: Date, completeTime: Date) {
        this.round = round;
        this.lobbyId = lobbyId;
        this.startTime = startTime;
        this.completeTime = completeTime;
    }
}
