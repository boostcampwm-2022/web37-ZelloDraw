import { QuizReplyType } from './quizReply.model';

export interface QuizReplyRequest {
    type: QuizReplyType;
    content: string;
}
