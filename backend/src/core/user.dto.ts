import { IsNotEmpty } from 'class-validator';

export class JoinLobbyRequest {
    @IsNotEmpty()
    public lobbyId: string;
}

export type JoinLobbyResponse = Array<{ userName: string; sid: string }>;

export interface JoinLobbyReEmitRequest {
    sid: string;
    userName: string;
}
