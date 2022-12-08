import { Game } from './game.interface';
import { Lobby } from './lobby.interface';
import { QuizReply } from './quizReply.model';
import { QuizReplyChain } from './quizReplyChain.model';
import { User } from './user.model';
import { PartialWithoutMethods } from '../utils/types';

export class GameLobby implements Lobby, Game {
    readonly id: string;
    host: User;
    users: User[];
    usersAliveState: boolean[];
    maxRound: number;
    curRound: number;
    roundType: 'DRAW' | 'ANSWER';
    roundLimitTime: number;
    submittedQuizRepliesOnCurrentRound: Array<QuizReply | undefined>;
    // isWatchedQuizReplyChain: boolean[];
    quizReplyChains: QuizReplyChain[];
    isPlaying: boolean;

    constructor(user: User) {
        this.id = this.createId(user.socketId);
        this.host = user;
        this.users = [];
        this.maxRound = 0;
        this.curRound = 0;
        this.roundType = 'ANSWER';
        this.roundLimitTime = 0;
        this.quizReplyChains = [];
        this.isPlaying = false;
    }

    static createByJson(json: PartialWithoutMethods<GameLobby>): GameLobby {
        const gameLobby = Object.assign(new GameLobby(json.host), json);
        gameLobby.quizReplyChains = gameLobby.quizReplyChains.map((quizReplyChain: any) => {
            return QuizReplyChain.createByJson(quizReplyChain);
        });
        return gameLobby;
    }

    getId(): string {
        return this.id;
    }

    getUsers(): User[] {
        return this.users;
    }

    getRoundType(): 'DRAW' | 'ANSWER' {
        return this.roundType;
    }

    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    getHost(): User {
        return this.host;
    }

    getMaxRound() {
        return this.maxRound;
    }

    getRoundLimitTime(): number {
        return this.roundLimitTime;
    }

    createId(hostId: string): string {
        return `${hostId}${new Date().getTime()}`;
    }

    joinLobby(user: User) {
        this.users.push(user);
    }

    leaveLobby(user: User) {
        this.users = this.users.filter((iUser) => iUser.socketId !== user.socketId);
    }

    leaveWhenPlayingGame(user: User) {
        const leavedUserIdx = this.getUserIndex(user);
        this.usersAliveState[leavedUserIdx] = false;
        this.polyFillQuizReply(user);
    }

    isHost(user: User): boolean {
        return this.host.socketId === user.socketId;
    }

    succeedHost() {
        const hostIdx = this.getUserIndex(this.host);
        this.host = hostIdx === 0 ? this.users[1] : this.users[0];
    }

    // TODO: 게임 시작시, 혹은 게임 종료 시 프로퍼티 초기화 로직 필요.
    startGame() {
        this.curRound = 0;
        this.maxRound = this.users.length - 1;
        this.curRound = 0;
        this.isPlaying = true;
        this.roundType = 'ANSWER';
        this.roundLimitTime = 60;
        this.quizReplyChains = this.users.map(() => {
            const quizReplyChain = new QuizReplyChain();
            // TODO: 랜덤 키워드는 외부 모듈에 의존하도록 수정
            const randomKeyword = `RANDOM${Math.floor(Math.random() * 100)}`;
            quizReplyChain.add(new QuizReply('ANSWER', randomKeyword));
            return quizReplyChain;
        });
        this.usersAliveState = this.users.map(() => true);
        this.submittedQuizRepliesOnCurrentRound = this.users.map(() => undefined);
        // this.isWatchedQuizReplyChain = this.users.map(() => false);
    }

    quitGame() {
        this.isPlaying = false;
    }

    getCurrentRoundQuizReplyChain(user: User): QuizReplyChain {
        const currentRoundQuizReplyChainIndex = this.currentRoundQuizReplyChainIndex(user);
        return this.quizReplyChains[currentRoundQuizReplyChainIndex];
    }

    submitQuizReply(user: User, quizReply: QuizReply) {
        const currentRoundQuizReplyChainIndex = this.currentRoundQuizReplyChainIndex(user);
        this.quizReplyChains[currentRoundQuizReplyChainIndex].put(this.curRound, quizReply);
        this.submittedQuizRepliesOnCurrentRound[this.getUserIndex(user)] = quizReply;
    }

    proceedRound() {
        // TODO: Round Type 바꾸는 로직 추가
        // TODO: Round Type에 맞게 RoundLimitTime 바뀌는 로직 추가
        this.curRound += 1;
        if (this.curRound > this.maxRound) {
            this.isPlaying = false;
        }
        this.swapRoundType();
        this.submittedQuizRepliesOnCurrentRound = this.users.map(() => undefined);
        this.polyFillDeadUsersQuizReply();
    }

    getSubmittedQuizRepliesCount(): number {
        return this.submittedQuizRepliesOnCurrentRound.filter((quizReply) => quizReply == undefined)
            .length;
    }

    getNotSubmittedUsers() {
        return this.submittedQuizRepliesOnCurrentRound.reduce(
            (acc: User[], quizReply: QuizReply | undefined, idx: number) => {
                if (quizReply === undefined) {
                    acc.push(this.users[idx]);
                }
                return acc;
            },
            [],
        );
    }

    isAllUserSubmittedQuizReply(): boolean {
        return this.submittedQuizRepliesOnCurrentRound.every((quizReply) => quizReply != undefined);
    }

    getQuizReplyChains(): QuizReplyChain[] {
        return this.quizReplyChains;
    }

    isLastRound(): boolean {
        return this.curRound === this.maxRound;
    }

    watchQuizReplyChain(index: number) {
        this.quizReplyChains[index].setIsWatched(true);
    }

    getIsWatchedQuizReplyChain(idx: number): boolean {
        return this.quizReplyChains[idx].getIsWatched();
    }

    private swapRoundType() {
        if (this.roundType === 'ANSWER') {
            this.roundType = 'DRAW';
            this.roundLimitTime = 60;
        } else {
            this.roundType = 'ANSWER';
            this.roundLimitTime = 30;
        }
    }

    private getUserIndex(user: User): number {
        return this.users.findIndex((iUser) => iUser.socketId === user.socketId);
    }

    // TODO: 유저별 가져가야 할 ReplyChainIndex를 따로 관리 하도록 하여 다른 메서드 에서는 유저가 각라운드에 가져가야 할 ReplyChainIndex 계산식을 모르게 하도록 수정
    private currentRoundQuizReplyChainIndex(user: User): number {
        return (this.getUserIndex(user) + this.curRound) % this.users.length;
    }

    private polyFillQuizReply(user: User) {
        const quizReply = QuizReply.createEmptyQuizReply(this.roundType, user);
        this.submitQuizReply(user, quizReply);
    }

    private polyFillDeadUsersQuizReply() {
        this.usersAliveState.forEach((isAlive, idx) => {
            if (!isAlive) {
                this.polyFillQuizReply(this.users[idx]);
            }
        });
    }
}
