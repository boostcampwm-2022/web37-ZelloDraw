import { QuizReply } from './quizReply.model';
import { PartialWithoutMethods } from '../utils/types';

export class QuizReplyChain {
    quizReplyList: QuizReply[];
    isWatched: boolean;

    constructor() {
        this.quizReplyList = [];
        this.isWatched = false;
    }

    static createByJson(json: PartialWithoutMethods<QuizReplyChain>) {
        const quizReplyChain = Object.assign(new QuizReplyChain(), json);
        quizReplyChain.quizReplyList = quizReplyChain.quizReplyList.map((quizReply: any) => {
            return QuizReply.createByJson(quizReply);
        });
        return quizReplyChain;
    }

    add(QuizReply: QuizReply) {
        this.quizReplyList.push(QuizReply);
    }

    get(index: number) {
        return this.quizReplyList[index];
    }

    put(index: number, quizReply: QuizReply) {
        this.quizReplyList[index] = quizReply;
    }

    getLastQuizReply() {
        return this.quizReplyList[this.quizReplyList.length - 1];
    }

    setIsWatched(isWatched: boolean) {
        this.isWatched = isWatched;
    }

    getIsWatched() {
        return this.isWatched;
    }
}
