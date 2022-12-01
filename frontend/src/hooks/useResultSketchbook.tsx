import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    currentBookIdxState,
    currentPageIdxState,
    isStartedState,
    maxSketchbookState,
} from '@atoms/result';
import useTimer from '@hooks/useTimer';
import { GUIDE_PAGE_IDX } from '@utils/constants';

function useResultSketchbook() {
    const isStarted = useRecoilValue(isStartedState);
    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const aSketchBookLimitTime = maxBookNum + 1;
    const interval = 2000;
    const { timeLeft, setTimerTime } = useTimer({
        interval,
        clearTimerDeps: currentBookIdx,
    });

    // TODO: 7. 이미 봤던 스케치북이라서 서버에서 isWatched: true를 보내면 Page를 조작할 수 있는 UI 띄우기
    // TODO: 8. 유저가 Page를 조작하는 것은 각자 클라이언트에서 자유롭게 조작해서 볼 수 있도록 하기

    useEffect(() => {
        if (isStarted) return;
        setTimerTime(aSketchBookLimitTime);
    }, [currentBookIdx, isStarted]);

    useEffect(() => {
        if (timeLeft === 0 || timeLeft === aSketchBookLimitTime) return;
        handleSketchbook();
    }, [timeLeft]);

    function handleSketchbook() {
        if (currentPageIdx === maxPageNum) {
            setCurrentPageIdx(GUIDE_PAGE_IDX);
            return;
        }

        // 스케치북 페이지를 넘긴다.
        const NextPageNumber = currentPageIdx + 1;
        setCurrentPageIdx(NextPageNumber);
    }
}
export default useResultSketchbook;
