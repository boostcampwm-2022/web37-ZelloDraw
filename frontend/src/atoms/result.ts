import { atom, selector } from 'recoil';
import { QuizReply } from '@backend/core/quizReply.model';
import { PartialWithoutMethods } from '@backend/utils/types';
import { GUIDE_PAGE_IDX } from '@utils/constants';

export const gameResultState = atom<Array<Array<PartialWithoutMethods<QuizReply>>>>({
    key: 'gameResultState',
    default: undefined,
});

export const gameResultIdState = atom<string>({
    key: 'gameResultIdState',
    default: undefined,
});

export const maxSketchbookState = selector({
    key: 'maxSketchbookState',
    get: ({ get }) => {
        const gameResult = get(gameResultState);
        return { maxBookNum: gameResult.length - 1, maxPageNum: gameResult[0].length - 1 };
    },
});

export const currentBookIdxState = atom<number>({
    key: 'currentBookIdxState',
    default: 0,
});

export const currentPageIdxState = atom<number>({
    key: 'currentPageIdxState',
    default: 0,
});

export const currentSketchbookState = selector({
    key: 'currentSketchbookState',
    get: ({ get }) => {
        const gameResult = get(gameResultState);
        const currentBookIdx = get(currentBookIdxState);
        const currentPageIdx = get(currentPageIdxState);

        const { maxBookNum } = get(maxSketchbookState);
        if (currentBookIdx > maxBookNum) return gameResult[0][0];

        return gameResult[currentBookIdx][currentPageIdx];
    },
});

export const sketchbookAuthorState = selector({
    key: 'sketchbookAuthorState',
    get: ({ get }) => {
        const gameResult = get(gameResultState);
        const currentBookIdx = get(currentBookIdxState);
        const { maxBookNum } = get(maxSketchbookState);
        if (currentBookIdx > maxBookNum) return '';

        const author = gameResult[currentBookIdx][0].author;
        if (author === undefined) return '';

        return author.name;
    },
});

export const isEndedState = selector({
    key: 'isEndedState',
    get: ({ get }) => {
        const { maxBookNum } = get(maxSketchbookState);
        const currentBookIdx = get(currentBookIdxState);
        const currentPageIdx = get(currentPageIdxState);
        return currentBookIdx === maxBookNum && currentPageIdx === GUIDE_PAGE_IDX;
    },
});

export const isStartedState = atom({
    key: 'isStartedState',
    default: true,
});

export const isWatchedBookState = atom<boolean>({
    key: 'isWatchedBookState',
    default: false,
});

export const canOneMoreGameState = atom<boolean>({
    key: 'isCanOneMoreState',
    default: false,
});

export const bookDirectionState = atom<1 | -1>({
    key: 'bookDirectionState',
    default: 1,
});

export const pageDirectionState = atom<1 | -1>({
    key: 'pageDirectionState',
    default: 1,
});
