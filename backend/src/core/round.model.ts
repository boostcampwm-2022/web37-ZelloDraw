import { IsNotEmpty } from 'class-validator';

export class Round {
    @IsNotEmpty()
    type: 'DRAW' | 'ANSWER';

    @IsNotEmpty()
    round: number;

    @IsNotEmpty()
    lobbyId: string;

    @IsNotEmpty()
    limitTime: number;

    @IsNotEmpty()
    word?: string[];

    @IsNotEmpty()
    image?: any[];
}
