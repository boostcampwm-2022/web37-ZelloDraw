import { networkServiceInstance as NetworkService } from '@services/socketService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { WatchResultSketchbookEmitRequest } from '@backend/core/game.dto';
import { useEffect } from 'react';
import { userState } from '@atoms/user';
import { currentBookIdxState, currentPageIdxState, isWatchedBookState } from '@atoms/result';

function useResultSocket(isForShareResult: boolean) {
    const { isHost } = useRecoilValue(userState);
    const setIsWatched = useSetRecoilState(isWatchedBookState);
    const setCurrentBookIdx = useSetRecoilState(currentBookIdxState);
    const setCurrentPageIdx = useSetRecoilState(currentPageIdxState);

    useEffect(() => {
        onWatchResultSketchBook();

        // 가장 처음 나타나는 스케치북도 봤다고 서버에게 알린다.
        if (isHost && !isForShareResult) emitWatchResultSketchBook(0);
    }, []);

    function onWatchResultSketchBook() {
        NetworkService.on(
            'watch-result-sketchbook',
            (bookIdxInfo: WatchResultSketchbookEmitRequest) => {
                setCurrentBookIdx(bookIdxInfo.bookIdx);
                setCurrentPageIdx(0);
                setIsWatched(bookIdxInfo.isWatched);
            },
        );
    }

    function emitWatchResultSketchBook(nextBookIdx: number) {
        NetworkService.emit('watch-result-sketchbook', { bookIdx: nextBookIdx });
    }

    function emitOneMoreGame() {
        NetworkService.emit('back-to-lobby');
    }

    return { emitWatchResultSketchBook, emitOneMoreGame };
}
export default useResultSocket;
