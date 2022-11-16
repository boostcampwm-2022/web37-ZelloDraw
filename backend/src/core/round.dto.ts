import { IsNotEmpty } from 'class-validator';

export class StartRoundRequest {
    @IsNotEmpty()
    public lobbyId: string;
}

export class CompleteRoundRequest {
    @IsNotEmpty()
    public lobbyId: string;
}
