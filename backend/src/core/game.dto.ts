import { QuizReply, QuizReplyType } from './quizReply.model';
import { PartialWithoutMethods } from '../utils/types';

export interface QuizReplyRequest {
    type: QuizReplyType;
    content: string;
}

export interface StartRoundEmitRequest {
    roundType: QuizReplyType;
    quizReply: PartialWithoutMethods<QuizReply>;
    curRound: number;
    maxRound: number;
    limitTime: number;
}

export interface SubmitQuizReplyRequest {
    quizReply: QuizReplyRequest;
}

export interface SubmitQuizReplyEmitRequest {
    submittedQuizReplyCount: number;
}

export interface CompleteGameResponse {
    quizReplyLists: QuizReply[][];
}
