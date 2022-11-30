import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import {
    currentPageIdxState,
    currentSketchbookState,
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

function ResultSketchbook() {
    const { maxPageNum } = useRecoilValue(maxSketchbookState);
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const sketchbookAuthor = useRecoilValue(sketchbookAuthorState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const { isHost } = useRecoilValue(userState);
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
                {checkIsNotGuidePage() && (
                    <>
                        {isHost ? <LeftArrowIcon /> : <Brace>&#123;</Brace>}
                        <AuthorName isHost={isHost}>{sketchbookAuthor}</AuthorName>
                        <AuthorName isHost={isHost}>유저1355</AuthorName>
                        {isHost ? <RightArrowIcon /> : <Brace>&#125;</Brace>}
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
