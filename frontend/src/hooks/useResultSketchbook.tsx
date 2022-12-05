import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    canOneMoreGameState,
    currentBookIdxState,
    currentPageIdxState,
    isEndedState,
    isStartedState,
    isWatchedBookState,
    maxSketchbookState,
} from '@atoms/result';
import useTimer from '@hooks/useTimer';
import { GUIDE_PAGE_IDX } from '@utils/constants';

function useResultSketchbook() {
    const isStarted = useRecoilValue(isStartedState);
    const isEnded = useRecoilValue(isEndedState);
    const isWatched = useRecoilValue(isWatchedBookState);
    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const setCanOneMoreGame = useSetRecoilState(canOneMoreGameState);
    const aSketchBookLimitTime = maxBookNum + 1;
    const interval = 2000;
    const { timeLeft, setTimerTime } = useTimer({
        interval,
        clearTimerDeps: currentBookIdx,
    });

    useEffect(() => {
        if (isStarted || isWatched) return;
        setTimerTime(aSketchBookLimitTime);
    }, [currentBookIdx, isStarted, isWatched]);

    useEffect(() => {
        if (timeLeft === 0 || timeLeft === aSketchBookLimitTime) return;
        addSketchbookPage();
    }, [timeLeft]);

    useEffect(() => {
        if (isEnded) setCanOneMoreGame(true);
    }, [isEnded]);

    function addSketchbookPage() {
        if (currentPageIdx === maxPageNum && !isWatched) {
            setCurrentPageIdx(GUIDE_PAGE_IDX);
            return;
        }

        // 유저가 페이지를 조작하는 상태에서 마지막 페이지가 왔을 경우
        if (currentPageIdx === maxPageNum && isWatched) return;

        goToNextPage(1);
    }

    function subtractSketchbookPage() {
        if (currentPageIdx === 0) return;

        goToNextPage(-1);
    }

    function goToNextPage(nextNum: number) {
        const NextPageNumber = currentPageIdx + nextNum;
        setCurrentPageIdx(NextPageNumber);
    }

    return { addSketchbookPage, subtractSketchbookPage };
}
export default useResultSketchbook;
