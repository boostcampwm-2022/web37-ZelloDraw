import { User } from './user.model';

export interface Lobby {
    joinLobby: (user: User, lobbyId: string) => any;
    leaveLobby: (user: User) => any;
}
