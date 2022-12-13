import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    canOneMoreGameState,
    currentBookIdxState,
    currentPageIdxState,
    isStartedState,
    maxSketchbookState,
} from '@atoms/result';

function useResultSketchbook(isForShareResult: boolean) {
    const setIsStarted = useSetRecoilState(isStartedState);
    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const setCanOneMoreGame = useSetRecoilState(canOneMoreGameState);

    useEffect(() => {
        // 결과 공유 페이지일 경우 설명페이지 없이 바로 결과만 볼 수 있도록 한다.
        if (isForShareResult) {
            setIsStarted(false);
            return;
        }

        // 결과 시작의 설명페이지를 보여준다.
        setTimeout(() => setIsStarted(false), 3000);
    }, []);

    // 게임 결과의 마지막이 오면 한판 더 할 수 있는 상태 설정
    useEffect(() => {
        if (currentBookIdx === maxBookNum && currentPageIdx === maxPageNum) setCanOneMoreGame(true);
    }, [currentBookIdx, currentPageIdx]);
}

export default useResultSketchbook;
