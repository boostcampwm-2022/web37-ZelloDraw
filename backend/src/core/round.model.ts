import { IsNotEmpty } from 'class-validator';

export class Round {
    @IsNotEmpty()
    round: number;

    @IsNotEmpty()
    lobbyId: string;

    constructor(round: number, lobbyId: string) {
        this.round = round;
        this.lobbyId = lobbyId;
    }
}
