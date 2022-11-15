import { IsNotEmpty } from 'class-validator';

export class CreateLobbyRequest {
    @IsNotEmpty()
    public userName: string;
}

export class JoinLobbyRequest {
    @IsNotEmpty()
    public userName: string;

    @IsNotEmpty()
    public lobbyId: string;
}
