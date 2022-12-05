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
import { userState } from '@atoms/user';
import useTimer from '@hooks/useTimer';
import { GUIDE_PAGE_IDX } from '@utils/constants';
import { emitWatchResultSketchBook, onWatchResultSketchBook } from '@game/NetworkServiceUtils';

function useResultSketchbook() {
    const { isHost } = useRecoilValue(userState);
    const [isStarted, setIsStarted] = useRecoilState(isStartedState);
    const [isWatched, setIsWatched] = useRecoilState(isWatchedBookState);
    const isEnded = useRecoilValue(isEndedState);

    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);

    const setCanOneMoreGame = useSetRecoilState(canOneMoreGameState);
    const aSketchBookLimitTime = maxBookNum + 1;
    const interval = 2000;
    const { timeLeft, setTimerTime } = useTimer({
        interval,
        clearTimerDeps: currentBookIdx,
    });

    useEffect(() => {
        setTimeout(() => setIsStarted(false), 3000);
        onWatchResultSketchBook(setCurrentBookIdx, setCurrentPageIdx, setIsWatched);
        // 가장 처음 나타나는 스케치북도 봤다고 서버에게 알린다.
        if (isHost) emitWatchResultSketchBook(0);
    }, []);

    useEffect(() => {
        if (isStarted || isWatched) return;
        setTimerTime(aSketchBookLimitTime);
    }, [currentBookIdx, isStarted, isWatched]);

    useEffect(() => {
        if (timeLeft === 0 || timeLeft === aSketchBookLimitTime) return;
        addSketchbookPage();
    }, [timeLeft]);

    useEffect(() => {
        if (currentBookIdx === maxBookNum && currentPageIdx === maxPageNum) setCanOneMoreGame(true);
    }, [currentBookIdx, currentPageIdx]);

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

    function changeSketchbook(nextNum: number) {
        const nextBookIdx = currentBookIdx + nextNum;
        emitWatchResultSketchBook(nextBookIdx);
    }

    return { addSketchbookPage, subtractSketchbookPage, changeSketchbook };
}
export default useResultSketchbook;
