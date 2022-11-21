import { Game } from './game.interface';
import { Lobby } from './lobby.interface';
import { QuizReply } from './quizReply.model';
import { QuizReplyChain } from './quizReplyChain.model';
import { Round } from './round.model';
import { User } from './user.model';

export class GameLobby implements Lobby, Game {
    id: string;
    host: User;
    users: User[];
    isPlaying: boolean;
    rounds: Round[];

    joinLobby(user: User, lobbyId: string) {
        console.error('join-lobby is not implemented');
    }

    leaveLobby(user: User) {
        console.error('leave-lobby is not implemented');
    }

    startGame(user: User) {
        console.error('startGame is not implemented');
    }

    getPrevQuizReply(user: User): QuizReply {
        console.error('getPrevQuizReply is not implemented');
        return new QuizReply();
    }

    submitQuizReply(user: User, quizReply: QuizReply) {
        console.error('submitQuizReply is not implemented');
    }

    proceedRound() {
        console.error('proceedRound is not implemented');
    }

    getQuizReplyChain(): QuizReplyChain {
        console.error('getQuizReplyChain is not implemented');
        return new QuizReplyChain();
    }
}
