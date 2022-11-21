import { User } from './user.model';

export class QuizReply {
    author: User;
    content: string;
    type: 'ANSWER' | 'DRAW';
}
