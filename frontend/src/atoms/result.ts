import { atom, selector } from 'recoil';
import { QuizReply } from '@backend/core/quizReply.model';

export const gameResultState = atom<QuizReply[][]>({
    key: 'gameResultState',
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
    default: -1, // 첫 시작시 가이드페이지가 나오도록 가이드페이지 인덱스로 기본 설정
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
        return currentBookIdx > maxBookNum && currentPageIdx === -1;
    },
});
