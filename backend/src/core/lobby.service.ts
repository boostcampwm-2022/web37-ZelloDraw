import { Injectable } from '@nestjs/common';
import { Player } from './player.dto';

export interface LobbyStore {
    [key: string]: Lobby;
}

export interface Lobby {
    id: string;
    owner: Player;
    players: Player[];
}
@Injectable()
export class LobbyService {
    store: LobbyStore = {};

    createLobby(clientPlayer: Player): string {
        const lobbyId = `${clientPlayer.socketId}${new Date().getTime()}`;
        this.store[lobbyId] = {
            id: lobbyId,
            owner: clientPlayer,
            players: [clientPlayer],
        };
        return lobbyId;
    }

    async joinLobby(clientPlayer: Player, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.players.push(clientPlayer);
        return lobby.players;
    }

    async leaveLobby(clientPlayer: Player, lobbyId: string) {
        const lobby = this.getLobby(lobbyId);
        lobby.players = lobby.players.filter((player) => player.socketId !== clientPlayer.socketId);
        return lobby.players;
    }

    validateLobby(lobbyId: string): void {
        if (this.store[lobbyId] === undefined) {
            throw Error('Lobby is not exists');
        }
    }

    isLobbyOwner(clientPlayer: Player, lobbyId: string): boolean {
        const lobby = this.getLobby(lobbyId);
        return lobby.owner.socketId === clientPlayer.socketId;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        this.validateLobby(lobbyId);
        return this.store[lobbyId];
    }
}
