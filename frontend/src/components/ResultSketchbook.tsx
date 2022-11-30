import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import {
    currentPageIdxState,
    currentSketchbookState,
    maxSketchbookState,
    sketchbookAuthorState,
} from '@atoms/result';
import SketchbookCard from '@components/SketchbookCard';
import RoundNumber from '@components/RoundNumber';
import ResultGuide from '@components/ResultGuide';
import QuizResultContent from '@components/QuizResultContent';
import useCheckGuidePage from '@hooks/useCheckGuidePage';
import useResultSketchbook from '@hooks/useResultSketchbook';

function ResultSketchbook() {
    const { maxPageNum } = useRecoilValue(maxSketchbookState);
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const sketchbookAuthor = useRecoilValue(sketchbookAuthorState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const { checkIsNotGuidePage } = useCheckGuidePage();

    useResultSketchbook();

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
