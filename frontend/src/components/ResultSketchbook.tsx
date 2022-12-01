import { useEffect } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    currentBookIdxState,
    currentPageIdxState,
    currentSketchbookState,
    isEndedState,
    isStartedState,
    maxSketchbookState,
    sketchbookAuthorState,
} from '@atoms/result';
import { userState } from '@atoms/user';
import SketchbookCard from '@components/SketchbookCard';
import RoundNumber from '@components/RoundNumber';
import ResultGuide from '@components/ResultGuide';
import QuizResultContent from '@components/QuizResultContent';
import useCheckGuidePage from '@hooks/useCheckGuidePage';
import useResultSketchbook from '@hooks/useResultSketchbook';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/chevron-left-gradient.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/chevron-right-gradient.svg';
import { emitWatchResultSketchBook, onWatchResultSketchBook } from '@game/NetworkServiceUtils';

function ResultSketchbook() {
    const { maxPageNum } = useRecoilValue(maxSketchbookState);
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const sketchbookAuthor = useRecoilValue(sketchbookAuthorState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const [currentPageIdx, setCurrentPageIdx] = useRecoilState(currentPageIdxState);
    const { isHost } = useRecoilValue(userState);
    const isEnded = useRecoilValue(isEndedState);
    const [isStarted, setIsStarted] = useRecoilState(isStartedState);

    const { checkIsNotGuidePage } = useCheckGuidePage();
    useResultSketchbook();

    useEffect(() => {
        setTimeout(() => setIsStarted(false), 3000);
        onWatchResultSketchBook(setCurrentBookIdx, setCurrentPageIdx);
    }, []);

    function changeSketchbook(nextNum: number) {
        const nextBookIdx = currentBookIdx + nextNum;
        emitWatchResultSketchBook(nextBookIdx);
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
                {!isStarted && (
                    <>
                        {isHost && currentBookIdx !== 0 && (
                            <LeftArrowIcon onClick={() => changeSketchbook(-1)} />
                        )}
                        {isHost && currentBookIdx === 0 && <EmptySpan />}
                        <Brace>&#123;</Brace>
                        <AuthorName isHost={isHost}>{sketchbookAuthor}</AuthorName>
                        <Brace>&#125;</Brace>
                        {isHost && !isEnded && (
                            <RightArrowIcon onClick={() => changeSketchbook(1)} />
                        )}
                        {isHost && isEnded && <EmptySpan />}
                        <span>의 스케치북</span>
                    </>
                )}
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

    > svg {
        margin: 0 28px;
        transform: scale(1.3) translateY(2px);
        cursor: pointer;
    }

    > span {
        font-weight: 600;
    }
`;

const AuthorName = styled.span<{ isHost: boolean | null }>`
    background: ${(props) =>
        props.isHost ? props.theme.gradation.yellowPurple : props.theme.color.whiteT2};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
`;

const Brace = styled.span`
    margin: 0 6px;
    font-family: 'Sniglet', cursive;
    font-weight: 700;
    font-size: ${({ theme }) => theme.typo.h1};
    transform: translateY(4px);
`;

const EmptySpan = styled.span`
    width: 30px;
    margin: 0 28px;
    transform: scale(1.3) translateY(2px);
`;
