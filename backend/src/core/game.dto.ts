import { QuizReply, QuizReplyType } from './quizReply.model';

export interface QuizReplyRequest {
    type: QuizReplyType;
    content: string;
}

export interface StartRoundEmitRequest {
    quizReply: QuizReply;
    round: number;
    limitTime: number;
}
