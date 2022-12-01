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
        const lastIdx = this.quizReplyList.length - 1;
        const lastQuizReply = this.quizReplyList[lastIdx];

        if (lastQuizReply.getType() === 'ANSWER') {
            return this.getLastValidAnswerTypeQuizReply(lastIdx);
        } else {
            return lastQuizReply;
        }
    }

    private getLastValidAnswerTypeQuizReply(index: number) {
        const lastReply = this.quizReplyList[index];
        if (lastReply.isEmptyAnswerTypeQuizReply()) {
            return this.getLastValidAnswerTypeQuizReply(index - 2);
        } else {
            return lastReply;
        }
    }
}
