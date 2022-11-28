import { QuizReply, QuizReplyType } from './quizReply.model';
import { PartialWithoutMethods } from '../utils/types';

// TODO: user 정보에서 socketId 정보는 제외하자.
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

export interface CompleteGameEmitRequest {
    quizReplyLists: Array<Array<PartialWithoutMethods<QuizReply>>>;
}
