import { QuizReply } from './quizReply.model';

export class QuizReplyChain {
    quizReplyList: QuizReply[];

    constructor() {
        this.quizReplyList = [];
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
