import { useResetRecoilState } from 'recoil';
import {
    canOneMoreGameState,
    currentBookIdxState,
    currentPageIdxState,
    gameResultState,
    isStartedState,
    isWatchedBookState,
} from '@atoms/result';

export function useResetGameState() {
    const recoilResetCallbacks = [
        useResetRecoilState(isStartedState),
        useResetRecoilState(isWatchedBookState),
        useResetRecoilState(gameResultState),
        useResetRecoilState(currentBookIdxState),
        useResetRecoilState(currentPageIdxState),
        useResetRecoilState(canOneMoreGameState),
    ];

    return () => {
        recoilResetCallbacks.forEach((callback) => callback());
    };
}
