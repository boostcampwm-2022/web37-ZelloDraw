import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    canOneMoreGameState,
    currentBookIdxState,
    currentPageIdxState,
    isStartedState,
    isWatchedBookState,
    maxSketchbookState,
} from '@atoms/result';
import { userState } from '@atoms/user';

import { emitWatchResultSketchBook, onWatchResultSketchBook } from '@game/NetworkServiceUtils';

function useResultSketchbook(isForShareResult: boolean) {
    const { isHost } = useRecoilValue(userState);
    const setIsStarted = useSetRecoilState(isStartedState);
    const setIsWatched = useSetRecoilState(isWatchedBookState);
    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);

    const setCanOneMoreGame = useSetRecoilState(canOneMoreGameState);

    useEffect(() => {
        // 결과 공유 페이지일 경우 설명페이지 없이 바로 결과만 볼 수 있도록 한다.
        if (isForShareResult) {
            setIsStarted(false);
            return;
        }

        // 결과 시작의 설명페이지를 보여준다.
        setTimeout(() => setIsStarted(false), 3000);
        onWatchResultSketchBook(setCurrentBookIdx, setCurrentPageIdx, setIsWatched);

        // 가장 처음 나타나는 스케치북도 봤다고 서버에게 알린다.
        if (isHost && !isForShareResult) emitWatchResultSketchBook(0);
    }, []);

    // 게임 결과의 마지막이 오면 한판 더 할 수 있는 상태 설정
    useEffect(() => {
        if (currentBookIdx === maxBookNum && currentPageIdx === maxPageNum) setCanOneMoreGame(true);
    }, [currentBookIdx, currentPageIdx]);
}

export default useResultSketchbook;
