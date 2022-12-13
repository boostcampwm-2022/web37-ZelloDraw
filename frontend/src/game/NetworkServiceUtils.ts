import { networkServiceInstance as NetworkService } from '@services/socketService';
import {
    CompleteGameEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
    WatchResultSketchbookEmitRequest,
} from '@backend/core/game.dto';
import { SetterOrUpdater } from 'recoil';
import { QuizReply } from '@backend/core/quizReply.model';
import { PartialWithoutMethods } from '@backend/utils/types';
import axios from 'axios';

export const emitSubmitQuizReply = (submitReply: SubmitQuizReplyRequest) => {
    NetworkService.emit('submit-quiz-reply', submitReply);
};

/**
 * 몇명이나 제출했는지 알려주는 이벤트, 클라이언트에서 'submit-quiz-reply' 발생시 서버에서 보내준다.
 */
export const onCountSubmittedQuiz = (setSubmittedQuizReplyCount: SetterOrUpdater<number>) => {
    NetworkService.on(
        'submit-quiz-reply',
        ({ submittedQuizReplyCount }: SubmitQuizReplyEmitRequest) => {
            setSubmittedQuizReplyCount(submittedQuizReplyCount);
        },
    );
};

export const onRoundTimeout = (setIsRoundTimeout: SetterOrUpdater<boolean>) => {
    NetworkService.on('round-timeout', () => setIsRoundTimeout(true));
};

export const onCompleteGame = (
    setGameResultId: SetterOrUpdater<string>,
    setGameResult: SetterOrUpdater<Array<Array<PartialWithoutMethods<QuizReply>>>>,
    setIsCompleteGame: SetterOrUpdater<boolean>,
) => {
    NetworkService.on('complete-game', (gameResult: CompleteGameEmitRequest) => {
        setGameResultId(gameResult.gameResultId);
        setGameResult(gameResult.quizReplyLists);
        setIsCompleteGame(true);
    });
};

export const queryAndSaveGameResult = async (
    setGameResult: SetterOrUpdater<Array<Array<PartialWithoutMethods<QuizReply>>>>,
    gameResultId: string,
) => {
    const gameResult = await axios.get(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${process.env.REACT_APP_REST_URL}/game-result/${gameResultId}`,
    );
    const gameReplyLists = createGameReplyLists(gameResult.data);
    setGameResult(gameReplyLists);
};

const createGameReplyLists = (gameResult: any) => {
    return gameResult.quizReplyChains.map((quizReplyChain: any) => {
        return quizReplyChain.quizReplyList.map((quizReply: any) => {
            return {
                author: {
                    name: quizReply.author,
                },
                content: quizReply.content,
                type: quizReply.type,
            };
        });
    });
};

export const emitWatchResultSketchBook = (nextBookIdx: number) => {
    NetworkService.emit('watch-result-sketchbook', { bookIdx: nextBookIdx });
};

export const onWatchResultSketchBook = (
    setCurrentBookIdx: SetterOrUpdater<number>,
    setCurrentPageIdx: SetterOrUpdater<number>,
    setIsWatched: SetterOrUpdater<boolean>,
) => {
    NetworkService.on(
        'watch-result-sketchbook',
        (bookIdxInfo: WatchResultSketchbookEmitRequest) => {
            setCurrentBookIdx(bookIdxInfo.bookIdx);
            setCurrentPageIdx(0);
            setIsWatched(bookIdxInfo.isWatched);
        },
    );
};

export const emitOneMoreGame = () => {
    NetworkService.emit('back-to-lobby');
};
