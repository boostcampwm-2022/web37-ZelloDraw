import { useEffect } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    currentBookIdxState,
    currentPageIdxState,
    currentSketchbookState,
    gameResultState,
    isEndedState,
    maxSketchbookState,
    sketchbookAuthorState,
} from '@atoms/result';
import SketchbookCard from '@components/SketchbookCard';
import RoundNumber from '@components/RoundNumber';
import ResultGuide from '@components/ResultGuide';
import useTimer from '@hooks/useTimer';
import QuizResultContent from '@components/QuizResultContent';
import useCheckGuidePage from '@hooks/useCheckGuidePage';

function ResultSketchbook() {
    const gameResults = useRecoilValue(gameResultState);
    // 스케치북 개수 * (스케치북 페이지 개수 + 가이드 페이지 개수)
    const allResultLimitTime = gameResults.length * (gameResults[0].length + 1);
    const { maxPageNum } = useRecoilValue(maxSketchbookState);
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const sketchbookAuthor = useRecoilValue(sketchbookAuthorState);
    const isEnded = useRecoilValue(isEndedState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const { timeLeft, setTimerTime } = useTimer(2000);
    const guidePageIdx = -1;
    const { checkIsNotGuidePage } = useCheckGuidePage();

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

    return (
        <>
            <SketchbookCard
                center={
                    <>
                        <QuizResultContent />
                        <ResultGuide />
                    </>
                }
                right={
                    checkIsNotGuidePage() && (
                        <>
                            <QuizAuthor>{currentSketchbook.author!.name}</QuizAuthor>
                            <RoundNumber cur={currentPageIdx} max={maxPageNum} />
                        </>
                    )
                }
            />
            <SketchbookAuthor>
                {checkIsNotGuidePage() && `${sketchbookAuthor}의 스케치북`}
            </SketchbookAuthor>
        </>
    );
}

export default ResultSketchbook;

const QuizAuthor = styled.div`
    position: relative;
    top: -40px;
    color: ${({ theme }) => theme.color.yellow};
    font-size: ${({ theme }) => theme.typo.h5};
`;

const SketchbookAuthor = styled(Center)`
    width: 100%;
    height: 65px;
    margin-top: 26px;
    color: ${({ theme }) => theme.color.whiteT2};
    font-size: ${({ theme }) => theme.typo.h2};
    text-shadow: ${({ theme }) => theme.shadow.text};
`;
