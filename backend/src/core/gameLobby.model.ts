import { Game } from './game.interface';
import { Lobby } from './lobby.interface';
import { QuizReply } from './quizReply.model';
import { QuizReplyChain } from './quizReplyChain.model';
import { User } from './user.model';

export class GameLobby implements Lobby, Game {
    readonly id: string;
    readonly host: User;
    users: User[];
    maxRound: number;
    curRound: number;
    readonly roundType: 'DRAW' | 'ANSWER';
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

    getId(): string {
        return this.id;
    }

    getUsers(): User[] {
        return this.users;
    }

    getHost(): User {
        return this.host;
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

    getCurrentRoundQuizReplyChain(user: User): QuizReplyChain {
        const currentRoundQuizReplyChainIndex = this.currentRoundQuizReplyChainIndex(user);
        return this.quizReplyChains[currentRoundQuizReplyChainIndex];
    }

    submitQuizReply(user: User, quizReply: QuizReply) {
        const currentRoundQuizReplyChainIndex = this.currentRoundQuizReplyChainIndex(user);
        this.quizReplyChains[currentRoundQuizReplyChainIndex].add(quizReply);
    }

    proceedRound() {
        this.curRound += 1;
        if (this.curRound >= this.maxRound) {
            this.isPlaying = false;
        }
    }

    getQuizReplyChains(): QuizReplyChain[] {
        return this.quizReplyChains;
    }

    private getUserIndex(user: User): number {
        return this.users.findIndex((iUser) => iUser.socketId === user.socketId);
    }

    // TODO: 유저별 가져가야 할 ReplyChainIndex를 따로 관리 하도록 하여 다른 메서드 에서는 유저가 각라운드에 가져가야 할 ReplyChainIndex 계산식을 모르게 하도록 수정
    private currentRoundQuizReplyChainIndex(user: User): number {
        return (this.getUserIndex(user) + this.curRound) % this.users.length;
    }
}
