import { IsNotEmpty } from 'class-validator';

export class Request {
    @IsNotEmpty()
    public name: string;
}

export class JoinLobbyRequest {
    @IsNotEmpty()
    public userName: string;

    @IsNotEmpty()
    public lobbyId: string;
}
