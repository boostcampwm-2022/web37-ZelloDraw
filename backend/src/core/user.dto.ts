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
    isHost: boolean;
}>;

export class JoinLobbyReEmitRequest {
    sid: string;
    userName: string;
    video?: boolean;
    audio?: boolean;

    constructor(userName: string, sid: string) {
        this.userName = userName;
        this.sid = sid;
    }
}

export class EmitLeaveGameRequest {
    sid: string;
    userName: string;
    constructor(userName: string, sid: string) {
        this.userName = userName;
        this.sid = sid;
    }
}
