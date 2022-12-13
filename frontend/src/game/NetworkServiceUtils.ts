import { networkServiceInstance as NetworkService } from '@services/socketService';
import { WatchResultSketchbookEmitRequest } from '@backend/core/game.dto';
import { SetterOrUpdater } from 'recoil';
import { QuizReply } from '@backend/core/quizReply.model';
import { PartialWithoutMethods } from '@backend/utils/types';
import axios from 'axios';

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
