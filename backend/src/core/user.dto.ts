import { IsNotEmpty } from 'class-validator';

export class JoinLobbyRequest {
    @IsNotEmpty()
    public lobbyId: string;
}

export type JoinLobbyResponse = Array<{ userName: string }>;

export interface JoinLobbyReEmitRequest {
    userName: string;
}
