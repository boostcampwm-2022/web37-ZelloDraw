import { QuizReply, QuizReplyType } from './quizReply.model';

export interface QuizReplyRequest {
    type: QuizReplyType;
    content: string;
}

export interface StartRoundEmitRequest {
    quizReply: QuizReply;
    curRound: number;
    maxRound: number;
    limitTime: number;
}
