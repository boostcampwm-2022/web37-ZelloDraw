import { QuizReply } from './quizReply.model';

export class QuizReplyChain {
    quizReplyList: QuizReply[];

    constructor() {
        this.quizReplyList = [];
    }

    add(QuizReply: QuizReply) {
        this.quizReplyList.push(QuizReply);
    }
}
