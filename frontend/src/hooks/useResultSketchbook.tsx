import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    currentBookIdxState,
    currentPageIdxState,
    gameResultState,
    isEndedState,
    maxSketchbookState,
} from '@atoms/result';
import useTimer from '@hooks/useTimer';

function useResultSketchbook() {
    const gameResults = useRecoilValue(gameResultState);
    const allResultLimitTime = gameResults.length * (gameResults[0].length + 1);

    const { maxPageNum } = useRecoilValue(maxSketchbookState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const isEnded = useRecoilValue(isEndedState);

    const guidePageIdx = -1;
    const interval = 2000;
    const { timeLeft, setTimerTime } = useTimer(interval);

    useEffect(() => {
        setTimerTime(allResultLimitTime);
    }, []);

    useEffect(() => {
        if (timeLeft === 0 || timeLeft === allResultLimitTime) return;
        handleSketchbook();
    }, [timeLeft]);

    function handleSketchbook() {
        if (isEnded) return;
        // 현재 스케치북의 마지막 장에 오면 다음 스케치북으로 idx로 변경한다.
        if (currentPageIdx === maxPageNum) {
            const nextBookIdx = currentBookIdx + 1;
            setCurrentBookIdx(nextBookIdx);
            setCurrentPageIdx(guidePageIdx);
            return;
        }
        // 스케치북 페이지를 넘긴다.
        const NextPageNumber = currentPageIdx + 1;
        setCurrentPageIdx(NextPageNumber);
    }
}
export default useResultSketchbook;
