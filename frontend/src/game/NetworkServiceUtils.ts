import { networkServiceInstance as NetworkService } from '@services/socketService';
import {
    CompleteGameEmitRequest,
    StartRoundEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
    WatchResultSketchbookEmitRequest,
} from '@backend/core/game.dto';
import { SetterOrUpdater } from 'recoil';
import { QuizReply } from '@backend/core/quizReply.model';

export const emitStartGame = (lobbyId: string) => {
    NetworkService.emit('start-game', lobbyId);
};

export const onStartGame = (
    setPage: (url: string) => void,
    setRoundInfo: SetterOrUpdater<StartRoundEmitRequest>,
) => {
    NetworkService.on('start-game', () => {
        setPage('/game');
    });

    NetworkService.on('start-round', (roundInfo: StartRoundEmitRequest) => {
        setRoundInfo(roundInfo);
    });
};

export const emitSubmitQuizReply = (submitReply: SubmitQuizReplyRequest) => {
    NetworkService.emit('submit-quiz-reply', submitReply);
};

/**
 * 몇명이나 제출했는지 알려주는 이벤트, 클라이언트에서 'submit-quiz-reply' 발생시 서버에서 보내준다.
 */
export const onCountSubmittedQuiz = () => {
    NetworkService.on(
        'submit-quiz-reply',
        ({ submittedQuizReplyCount }: SubmitQuizReplyEmitRequest) => {
            console.log(submittedQuizReplyCount);
        },
    );
};

export const onRoundTimeout = (setIsRoundTimeout: SetterOrUpdater<boolean>) => {
    NetworkService.on('round-timeout', () => setIsRoundTimeout(true));
};

export const onCompleteGame = (
    setGameResult: SetterOrUpdater<QuizReply[][]>,
    setIsCompleteGame: SetterOrUpdater<boolean>,
) => {
    NetworkService.on('complete-game', (gameResult: CompleteGameEmitRequest) => {
        setGameResult(gameResult.quizReplyLists);
        setIsCompleteGame(true);
    });
};

export const emitWatchResultSketchBook = (nextBookIdx: number) => {
    NetworkService.emit('watch-result-sketchbook', { bookIdx: nextBookIdx });
};

export const onWatchResultSketchBook = () => {
    NetworkService.on(
        'watch-result-sketchbook',
        (bookIdxInfo: WatchResultSketchbookEmitRequest) => {
            console.log('스케치북 인포', bookIdxInfo);
        },
    );
};
