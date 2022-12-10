import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    bookDirectionState,
    canOneMoreGameState,
    currentBookIdxState,
    currentPageIdxState,
    isStartedState,
    isWatchedBookState,
    maxSketchbookState,
    pageDirectionState,
} from '@atoms/result';
import { userState } from '@atoms/user';
import useTimer from '@hooks/useTimer';
import { GUIDE_PAGE_IDX } from '@utils/constants';
import { emitWatchResultSketchBook, onWatchResultSketchBook } from '@game/NetworkServiceUtils';

function useResultSketchbook(controlOnLocal: boolean) {
    const { isHost } = useRecoilValue(userState);
    const [isStarted, setIsStarted] = useRecoilState(isStartedState);
    const [isWatched, setIsWatched] = useRecoilState(isWatchedBookState);

    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const setBookDirection = useSetRecoilState(bookDirectionState);
    const setPageDirection = useSetRecoilState(pageDirectionState);

    const setCanOneMoreGame = useSetRecoilState(canOneMoreGameState);
    const aSketchBookLimitTime = maxBookNum + 1;
    const interval = 2000;
    const { timeLeft, setTimerTime } = useTimer({
        interval,
        clearTimerDeps: currentBookIdx,
    });

    useEffect(() => {
        if (!controlOnLocal) {
            setTimeout(() => setIsStarted(false), 3000);
        } else {
            setIsStarted(false);
        }
        onWatchResultSketchBook(setCurrentBookIdx, setCurrentPageIdx, setIsWatched);
        // 가장 처음 나타나는 스케치북도 봤다고 서버에게 알린다.
        if (isHost && !controlOnLocal) emitWatchResultSketchBook(0);
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

        setPageDirection(1);
        goToNextPage(1);
    }

    function subtractSketchbookPage() {
        if (currentPageIdx === 0) return;

        setPageDirection(-1);
        goToNextPage(-1);
    }

    function goToNextPage(nextNum: number) {
        const NextPageNumber = currentPageIdx + nextNum;
        setCurrentPageIdx(NextPageNumber);
    }

    function changeSketchbook(nextNum: 1 | -1) {
        setBookDirection(nextNum);
        const nextBookIdx = currentBookIdx + nextNum;

        if (controlOnLocal) {
            setCurrentBookIdx(nextBookIdx);
            setCurrentPageIdx(0);
            setIsWatched(true);
        } else {
            emitWatchResultSketchBook(nextBookIdx);
        }
    }

    return { addSketchbookPage, subtractSketchbookPage, changeSketchbook };
}
export default useResultSketchbook;
