import { User } from './user.model';

export interface Lobby {
    joinLobby: (user: User) => any;
    leaveLobby: (user: User) => any;
    getId: () => string;
    getUsers: () => User[];
    getHost: () => User;
}
