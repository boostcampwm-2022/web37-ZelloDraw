import { User } from './user.model';

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
}
