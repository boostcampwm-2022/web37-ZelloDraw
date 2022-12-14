import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    currentBookIdxState,
    currentPageIdxState,
    isStartedState,
    isWatchedBookState,
    maxSketchbookState,
    pageDirectionState,
} from '@atoms/result';
import { GUIDE_PAGE_IDX } from '@utils/constants';
import { ReactComponent as DownArrowIcon } from '@assets/icons/chevron-down.svg';
import { ReactComponent as UpArrowIcon } from '@assets/icons/chevron-up.svg';
import pageUpSound from '@assets/sounds/page-up.wav';
import pageDownSound from '@assets/sounds/page-down.wav';
import CurAndMaxNumber from '@components/CurAndMaxNumber';
import useSoundEffect from '@hooks/useSoundEffect';
import { useEffect } from 'react';
import useTimer from '@hooks/useTimer';

function CurSketchbookPage({ isForShareResult }: { isForShareResult: boolean }) {
    const isWatchedSketchbook = useRecoilValue(isWatchedBookState);
    const isStartedResult = useRecoilValue(isStartedState);
    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const setPageDirection = useSetRecoilState(pageDirectionState);
    const aSketchBookLimitTime = maxBookNum + 1;
    const interval = 2000;
    const { timeLeft, setTimerTime } = useTimer({
        interval,
        clearTimerDeps: currentBookIdx,
    });
    const { playSoundEffect } = useSoundEffect();

    useEffect(() => {
        if (isStartedResult || isWatchedSketchbook || isForShareResult) return;
        setTimerTime(aSketchBookLimitTime);
    }, [currentBookIdx, isStartedResult, isWatchedSketchbook]);

    useEffect(() => {
        if (timeLeft === 0 || timeLeft === aSketchBookLimitTime) return;
        addSketchbookPage();
    }, [timeLeft]);

    function addSketchbookPage() {
        if (currentPageIdx === maxPageNum && !isWatchedSketchbook) {
            setCurrentPageIdx(GUIDE_PAGE_IDX);
            return;
        }

        // ????????? ???????????? ???????????? ???????????? ????????? ???????????? ?????? ??????
        if (currentPageIdx === maxPageNum && isWatchedSketchbook) return;

        setPageDirection(1);
        goToNextPage(1);

        playSoundEffect(pageUpSound);
    }

    function subtractSketchbookPage() {
        if (currentPageIdx === 0) return;

        setPageDirection(-1);
        goToNextPage(-1);

        playSoundEffect(pageDownSound);
    }

    function goToNextPage(nextNum: number) {
        const NextPageNumber = currentPageIdx + nextNum;
        setCurrentPageIdx(NextPageNumber);
    }

    return (
        <CurPageWrapper>
            {isWatchedSketchbook && (
                <UpArrowWrapper
                    disable={currentPageIdx === maxPageNum}
                    disabled={currentPageIdx === maxPageNum}
                    onClick={addSketchbookPage}
                    aria-label={'?????? ???????????? ????????? ??????'}
                >
                    <UpArrowIcon />
                </UpArrowWrapper>
            )}
            <CurAndMaxNumber
                cur={currentPageIdx}
                max={maxPageNum}
                gradient={'whitePurple'}
                strokeColor={'primaryLight'}
            />
            {isWatchedSketchbook && (
                <DownArrowWrapper
                    disable={currentPageIdx === 0}
                    disabled={currentPageIdx === 0}
                    onClick={subtractSketchbookPage}
                    aria-label={'?????? ???????????? ????????? ??????'}
                >
                    <DownArrowIcon />
                </DownArrowWrapper>
            )}
        </CurPageWrapper>
    );
}

export default CurSketchbookPage;

const CurPageWrapper = styled(Center)`
    justify-content: end;
    flex-direction: column;
`;

const ArrowWrapper = styled.button<{ disable: boolean }>`
    cursor: ${(props) => (props.disable ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.disable ? 0.4 : 1)};
`;

const UpArrowWrapper = styled(ArrowWrapper)`
    > svg {
        margin-bottom: -8px;
    }
`;

const DownArrowWrapper = styled(ArrowWrapper)`
    > svg {
        margin-top: 8px;
    }
`;
