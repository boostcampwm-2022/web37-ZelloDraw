import { QuizReply, QuizReplyType } from './quizReply.model';
import { PartialWithoutMethods } from '../utils/types';

export interface QuizReplyRequest {
    type: QuizReplyType;
    content: string;
}

export interface StartRoundEmitRequest {
    quizReply: PartialWithoutMethods<QuizReply>;
    curRound: number;
    maxRound: number;
    limitTime: number;
}

export interface SubmitQuizReplyRequest {
    quizReply: PartialWithoutMethods<QuizReply>;
}

export interface SubmitQuizReplyEmitRequest {
    submittedQuizReplyCount: number;
}
