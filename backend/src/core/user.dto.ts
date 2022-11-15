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

export type JoinLobbyResponse = Array<{ userName: string }>;

export interface JoinLobbyReEmitRequest {
    userName: string;
}
