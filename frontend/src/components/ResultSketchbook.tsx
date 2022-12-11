import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import {
    canOneMoreGameState,
    currentBookIdxState,
    currentPageIdxState,
    currentSketchbookState,
    gameResultIdState,
    isStartedState,
    isWatchedBookState,
    maxSketchbookState,
    sketchbookAuthorState,
} from '@atoms/result';
import { userState } from '@atoms/user';
import SketchbookCard from '@components/SketchbookCard';
import CurAndMaxNumber from '@components/CurAndMaxNumber';
import ResultGuide from '@components/ResultGuide';
import QuizResultContent from '@components/QuizResultContent';
import useCheckGuidePage from '@hooks/useCheckGuidePage';
import useResultSketchbook from '@hooks/useResultSketchbook';
import PrimaryButton from '@components/PrimaryButton';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/chevron-left-gradient.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/chevron-right-gradient.svg';
import { ReactComponent as DownArrowIcon } from '@assets/icons/chevron-down.svg';
import { ReactComponent as UpArrowIcon } from '@assets/icons/chevron-up.svg';
import { ReactComponent as ExportIcon } from '@assets/icons/export-icon.svg';
import { emitOneMoreGame } from '@game/NetworkServiceUtils';
import { useEffect } from 'react';
import { networkServiceInstance as NetworkService } from '@services/socketService';
import useMovePage from '@hooks/useMovePage';
import { lobbyIdState } from '@atoms/game';
import toast, { Toaster } from 'react-hot-toast';
import useCopyClipBoard from '@hooks/useCopyClipboard';

function ResultSketchbook(props: { isForShareResult: boolean }) {
    const [setPage] = useMovePage();
    const lobbyId = useRecoilValue(lobbyIdState);
    const gameResultId = useRecoilValue(gameResultIdState);
    const { maxPageNum, maxBookNum } = useRecoilValue(maxSketchbookState);
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const sketchbookAuthor = useRecoilValue(sketchbookAuthorState);
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);

    const { isHost } = useRecoilValue(userState);
    const isStarted = useRecoilValue(isStartedState);
    const isWatched = useRecoilValue(isWatchedBookState);
    const canOneMoreGame = useRecoilValue(canOneMoreGameState);

    const { checkIsNotGuidePage } = useCheckGuidePage();
    const { addSketchbookPage, subtractSketchbookPage, changeSketchbook } = useResultSketchbook(
        props.isForShareResult,
    );

    const [_, onCopy] = useCopyClipBoard();

    useEffect(() => {
        NetworkService.on('back-to-lobby', () => {
            setPage(`/lobby?id=${lobbyId}&new=false`);
        });

        return () => {
            NetworkService.off('back-to-lobby');
        };
    }, []);

    const copyGameResultIdOnClipboard = () => {
        const gameResultShareUrl = `${window.location.origin}/share-result/${gameResultId}`;
        void onCopy(gameResultShareUrl);
        toast('🖇 클립보드에 복사되었습니다.');
    };
    return (
        <>
            <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 1500 }} />
            <SketchbookCard
                center={
                    <>
                        <QuizResultContent />
                        {!props.isForShareResult && <ResultGuide />}
                    </>
                }
                right={
                    checkIsNotGuidePage() && (
                        <>
                            <QuizAuthor>
                                <SmallBrace>{'{'}</SmallBrace>
                                <QuizAuthorName>{currentSketchbook.author!.name}</QuizAuthorName>
                                <SmallBrace>{'}'}</SmallBrace>
                            </QuizAuthor>
                            <RoundNumberWrapper>
                                {isWatched && (
                                    <UpArrowWrapper disable={currentPageIdx === maxPageNum}>
                                        <UpArrowIcon onClick={addSketchbookPage} />
                                    </UpArrowWrapper>
                                )}
                                <CurAndMaxNumber
                                    cur={currentPageIdx}
                                    max={maxPageNum}
                                    gradient={'whitePurple'}
                                    strokeColor={'primaryLight'}
                                />
                                {isWatched && (
                                    <DownArrowWrapper disable={currentPageIdx === 0}>
                                        <DownArrowIcon onClick={subtractSketchbookPage} />
                                    </DownArrowWrapper>
                                )}
                            </RoundNumberWrapper>
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
                        <Brace>{'{'}</Brace>
                        <SketchbookAuthorName isHost={isHost}>
                            {sketchbookAuthor}
                        </SketchbookAuthorName>
                        <Brace>{'}'}</Brace>
                        <span>의 스케치북</span>
                        {isHost && currentBookIdx === maxBookNum && <EmptySpan />}
                        {isHost && currentBookIdx !== maxBookNum && (
                            <RightArrowIcon onClick={() => changeSketchbook(1)} />
                        )}
                        {(props.isForShareResult || canOneMoreGame) && (
                            <ExportIcon onClick={copyGameResultIdOnClipboard} />
                        )}
                        {!props.isForShareResult && canOneMoreGame && isHost && (
                            <OneMoreButtonWrapper onClick={emitOneMoreGame}>
                                <PrimaryButton topText='ONE MORE' bottomText='한판 더 하기' />
                            </OneMoreButtonWrapper>
                        )}
                    </>
                )}
            </SketchbookAuthor>
        </>
    );
}

export default ResultSketchbook;

const QuizAuthor = styled.div`
    position: relative;
    top: -56px;
`;

const QuizAuthorName = styled.span`
    background: ${({ theme }) => theme.gradation.whitePurple2};
    ${({ theme }) => theme.layout.gradientTypo}
    -webkit-text-stroke:${({ theme }) => theme.color.primaryLight};
    font-size: ${({ theme }) => theme.typo.h5};
    font-weight: 600;
    word-break: keep-all;
`;

const SketchbookAuthor = styled(Center)`
    width: 100%;
    height: 65px;
    position: relative;
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

const SketchbookAuthorName = styled.span<{ isHost: boolean | null }>`
    background: ${(props) =>
        props.isHost ? props.theme.gradation.yellowPurple : props.theme.color.whiteT2};
    ${({ theme }) => theme.layout.gradientTypo}
`;

const Brace = styled.span`
    margin: 0 6px;
    font-family: 'Sniglet', cursive;
    font-weight: 700;
    font-size: ${({ theme }) => theme.typo.h1};
    transform: translateY(4px);
`;

const SmallBrace = styled(Brace)`
    font-size: ${({ theme }) => theme.typo.h4};
    color: ${({ theme }) => theme.color.whiteT2};
    position: relative;
    top: 1px;
`;

const EmptySpan = styled.span`
    width: 30px;
    margin: 0 28px;
    transform: scale(1.3) translateY(2px);
`;

const RoundNumberWrapper = styled(Center)`
    justify-content: end;
    flex-direction: column;
`;

const UpArrowWrapper = styled.div<{ disable: boolean }>`
    > svg {
        cursor: ${(props) => (props.disable ? 'not-allowed' : 'pointer')};
        opacity: ${(props) => (props.disable ? 0.4 : 1)};
        margin-bottom: -8px;
    }
`;
const DownArrowWrapper = styled.div<{ disable: boolean }>`
    > svg {
        cursor: ${(props) => (props.disable ? 'not-allowed' : 'pointer')};
        opacity: ${(props) => (props.disable ? 0.4 : 1)};
        margin-top: 8px;
    }
`;

const OneMoreButtonWrapper = styled.div`
    position: absolute;
    right: 0;
`;
