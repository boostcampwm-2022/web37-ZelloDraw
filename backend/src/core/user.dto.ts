import { IsNotEmpty } from 'class-validator';

export class JoinLobbyRequest {
    @IsNotEmpty()
    public lobbyId: string;
}

export type JoinLobbyResponse = Array<{
    userName: string;
    sid: string;
    video: boolean;
    audio: boolean;
}>;

export interface JoinLobbyReEmitRequest {
    sid: string;
    userName: string;
}
