import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { gameResultState } from '@atoms/game';
import SketchbookCard from '@components/SketchbookCard';
import RoundNumber from '@components/RoundNumber';
import ResultGuide from '@components/ResultGuide';
import useTimer from '@hooks/useTimer';

function ResultSketchbook() {
    const gameResults = useRecoilValue(gameResultState);
    const maxSketchbookNum = gameResults.length - 1;
    const maxPageNum = gameResults[0].length - 1;
    // 스케치북 개수 * (스케치북 페이지 개수 + 가이드 페이지 개수)
    const allResultLimitTime = gameResults.length * (gameResults[0].length + 1);
    const guidePageNum = -1;
    const [currentSketchbook, setCurrentSketchbook] = useState(gameResults[0]);
    const [sketchbookNum, setSketchbookNum] = useState(0);
    const [currentPage, setCurrentPage] = useState(gameResults[0][0]);
    const [pageNum, setPageNum] = useState(guidePageNum);
    const [sketchbookAuthorName, setSketchbookAuthorName] = useState('');
    const [isEnded, setIsEnded] = useState(false);
    const { timeLeft, setTimerTime } = useTimer(2000);

    useEffect(() => {
        setTimerTime(allResultLimitTime);
    }, []);

    useEffect(() => {
        if (timeLeft === 0 || timeLeft === allResultLimitTime) return;
        handleSketchbook();
    }, [timeLeft]);

    useEffect(() => {
        if (pageNum !== 0 || currentSketchbook === undefined) return;

        const { author } = currentSketchbook[pageNum];
        if (author === undefined) return;
        // 새 스케치북이 시작되면 스케치북 주인 이름을 설정한다.
        setSketchbookAuthorName(author.name);
    }, [pageNum, currentSketchbook]);

    useEffect(() => {
        if (sketchbookNum === maxSketchbookNum && pageNum === maxPageNum) {
            setTimeout(() => {
                setIsEnded(true);
            }, 2000);
        }
    }, [sketchbookNum, pageNum]);

    function handleSketchbook() {
        if (currentSketchbook === undefined || isEnded) return;

        // 현재 스케치북의 마지막 장에 오면 새 스케치북으로 변경한다.
        if (pageNum === maxPageNum) {
            const nextResultNumber = sketchbookNum + 1;
            setCurrentSketchbook(gameResults[nextResultNumber]);
            setSketchbookNum(nextResultNumber);
            setPageNum(guidePageNum);
            return;
        }
        // 스케치북을 넘긴다.
        const NextPageNumber = pageNum + 1;
        setCurrentPage(currentSketchbook[NextPageNumber]);
        setPageNum(NextPageNumber);
    }

    function checkIsNotGuidePage() {
        return pageNum > guidePageNum && !isEnded;
    }

    return (
        <>
            <SketchbookCard
                center={
                    <>
                        {checkIsNotGuidePage() && (
                            <QuizResult>
                                {currentPage.type === 'DRAW' ? (
                                    <img src={currentPage.content} />
                                ) : (
                                    <div>{currentPage.content}</div>
                                )}
                            </QuizResult>
                        )}
                        <ResultGuide
                            sketchbookNum={sketchbookNum}
                            pageNum={pageNum}
                            isEnded={isEnded}
                        />
                    </>
                }
                right={
                    <>
                        <QuizAuthor>{checkIsNotGuidePage() && currentPage.author!.name}</QuizAuthor>
                        {checkIsNotGuidePage() && <RoundNumber cur={pageNum} max={maxPageNum} />}
                    </>
                }
            />
            <SketchbookAuthor>
                {checkIsNotGuidePage() && `${sketchbookAuthorName}의 스케치북`}
            </SketchbookAuthor>
        </>
    );
}
export default ResultSketchbook;

const QuizResult = styled(Center)`
    ${({ theme }) => theme.layout.sketchBook};
    > img {
        width: 100%;
    }

    > div {
        color: ${({ theme }) => theme.color.black};
        font-size: ${({ theme }) => theme.typo.h1};
        letter-spacing: 0.13rem;
    }
`;
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
