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
