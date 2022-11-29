import { QuizReply } from './quizReply.model';
import { PartialWithoutMethods } from '../utils/types';

export class QuizReplyChain {
    quizReplyList: QuizReply[];

    constructor() {
        this.quizReplyList = [];
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

    put(index: number, quizReply: QuizReply) {
        this.quizReplyList[index] = quizReply;
    }

    getLastQuizReply() {
        return this.quizReplyList[this.quizReplyList.length - 1];
    }
}
