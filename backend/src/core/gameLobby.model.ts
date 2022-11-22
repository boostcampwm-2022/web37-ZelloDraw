import { Game } from './game.interface';
import { Lobby } from './lobby.interface';
import { QuizReply } from './quizReply.model';
import { QuizReplyChain } from './quizReplyChain.model';
import { User } from './user.model';

export class GameLobby implements Lobby, Game {
    id: string;
    host: User;
    users: User[];
    maxRound: number;
    curRound: number;
    roundType: 'DRAW' | 'ANSWER';
    roundLimitTime: number;
    quizReplyChains: QuizReplyChain[];
    isPlaying: boolean;

    constructor(user: User) {
        this.id = `${user.socketId}${new Date().getTime()}`;
        this.host = user;
        this.users = [];
        this.maxRound = 0;
        this.curRound = 0;
        this.roundType = 'ANSWER';
        this.roundLimitTime = 0;
        this.quizReplyChains = [];
        this.isPlaying = false;
    }

    joinLobby(user: User) {
        this.users.push(user);
    }

    leaveLobby(user: User) {
        this.users = this.users.filter((iUser) => iUser.socketId !== user.socketId);
    }

    startGame(maxRound: number, roundLimitTime: number) {
        this.maxRound = maxRound;
        this.roundLimitTime = roundLimitTime;
        this.isPlaying = true;
        this.quizReplyChains = this.users.map(() => {
            const quizReplyChain = new QuizReplyChain();
            // TODO: 랜덤 키워드는 외부 모듈에 의존하도록 수정
            const randomKeyword = `RANDOM${Math.floor(Math.random() * 100)}`;
            quizReplyChain.add(new QuizReply('ANSWER', randomKeyword));
            return quizReplyChain;
        });
    }

    getPrevQuizReply(user: User): QuizReply {
        console.error('getPrevQuizReply is not implemented');
        return undefined;
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
