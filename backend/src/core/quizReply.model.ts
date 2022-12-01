import { User } from './user.model';
import { PartialWithoutMethods } from '../utils/types';

export type QuizReplyType = 'ANSWER' | 'DRAW';

export class QuizReply {
    author: User | undefined; // undefined 일 시 Random 생성된 제시어
    content: string;
    type: QuizReplyType;

    constructor(type: QuizReplyType, content: string, author?: User) {
        this.type = type;
        this.content = content;
        this.author = author;
    }

    getType(): QuizReplyType {
        return this.type;
    }

    isEmptyAnswerTypeQuizReply(): boolean {
        return this.type === 'ANSWER' && this.content === undefined;
    }

    static createByJson(json: PartialWithoutMethods<QuizReply>): QuizReply {
        return new QuizReply(json.type, json.content, json.author);
    }

    static createEmptyQuizReply(type: QuizReplyType): QuizReply {
        return new QuizReply(type, undefined);
    }
}
