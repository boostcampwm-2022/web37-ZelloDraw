import { QuizReply } from './quizReply.model';
import { QuizReplyChain } from './quizReplyChain.model';
import { User } from './user.model';

export interface Game {
    startGame: (maxRound: number, roundLimitTime: number) => any;
    getPrevQuizReply: (user: User) => QuizReply;
    submitQuizReply: (user: User, quizReply: QuizReply) => any;
    proceedRound: () => any;
    getQuizReplyChain: () => QuizReplyChain;
}
