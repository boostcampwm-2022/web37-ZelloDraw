import { IsNotEmpty } from 'class-validator';

export class StartRoundRequest {
    @IsNotEmpty()
    public round: number;

    @IsNotEmpty()
    public lobbyId: string;
}

export class CompleteRoundRequest {
    @IsNotEmpty()
    public round: number;

    @IsNotEmpty()
    public lobbyId: string;
}
