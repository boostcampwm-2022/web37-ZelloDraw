import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import {
    canOneMoreGameState,
    currentBookIdxState,
    gameResultIdState,
    isStartedState,
    maxSketchbookState,
    sketchbookAuthorState,
} from '@atoms/result';
import { userState } from '@atoms/user';
import { lobbyIdState } from '@atoms/game';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/chevron-left-gradient.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/chevron-right-gradient.svg';
import { ReactComponent as ExportIcon } from '@assets/icons/export-icon.svg';
import resultInSound from '@assets/sounds/result-in.wav';
import { networkServiceInstance as NetworkService } from '@services/socketService';
import { emitOneMoreGame } from '@game/NetworkServiceUtils';
import useMovePage from '@hooks/useMovePage';
import useCheckGuidePage from '@hooks/useCheckGuidePage';
import useResultSketchbook from '@hooks/useResultSketchbook';
import useCopyClipBoard from '@hooks/useCopyClipboard';
import useSoundEffect from '@hooks/useSoundEffect';
import PrimaryButton from '@components/PrimaryButton';
import SketchbookCard from '@components/SketchbookCard';
import ResultGuide from '@components/resultSketchbook/ResultGuide';
import QuizResultContent from '@components/resultSketchbook/QuizResultContent';
import QuizAuthor from '@components/resultSketchbook/QuizAuthor';
import CurSketchbookPage from '@components/resultSketchbook/CurSketchbookPage';

function ResultSketchbook({ isForShareResult }: { isForShareResult: boolean }) {
    const [setPage] = useMovePage();
    const lobbyId = useRecoilValue(lobbyIdState);
    const gameResultId = useRecoilValue(gameResultIdState);
    const { maxBookNum } = useRecoilValue(maxSketchbookState);
    const sketchbookAuthor = useRecoilValue(sketchbookAuthorState);
    const currentBookIdx = useRecoilValue(currentBookIdxState);

    const { isHost } = useRecoilValue(userState);
    const isStarted = useRecoilValue(isStartedState);
    const canOneMoreGame = useRecoilValue(canOneMoreGameState);

    const { checkIsNotGuidePage } = useCheckGuidePage();
    const { changeSketchbook } = useResultSketchbook(isForShareResult);
    const [_, onCopy] = useCopyClipBoard();
    const { playSoundEffect } = useSoundEffect();

    useEffect(() => {
        if (!isForShareResult) playSoundEffect(resultInSound);

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
                        {!isForShareResult && <ResultGuide />}
                    </>
                }
                right={
                    checkIsNotGuidePage() && (
                        <>
                            <QuizAuthor />
                            <CurSketchbookPage isForShareResult={isForShareResult} />
                        </>
                    )
                }
            />
            <SketchbookAuthor>
                {!isStarted && (
                    <>
                        {isHost && currentBookIdx !== 0 && (
                            <LeftArrowIcon
                                onClick={() => changeSketchbook(-1)}
                                role={'button'}
                                aria-label={'이전 유저 스케치북 보기'}
                            />
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
                            <RightArrowIcon
                                onClick={() => changeSketchbook(1)}
                                role={'button'}
                                aria-label={'다음 유저 스케치북 보기'}
                            />
                        )}

                        <ButtonWrapper>
                            {(isForShareResult || canOneMoreGame) && (
                                <ExportIcon
                                    onClick={copyGameResultIdOnClipboard}
                                    role={'button'}
                                    aria-label={'게임 결과 페이지 링크 복사'}
                                />
                            )}
                            {!isForShareResult && canOneMoreGame && isHost && (
                                <div
                                    onClick={emitOneMoreGame}
                                    role={'button'}
                                    aria-label={'게임 한판 더 하기'}
                                >
                                    <PrimaryButton topText='ONE MORE' bottomText='한판 더 하기' />
                                </div>
                            )}
                        </ButtonWrapper>
                    </>
                )}
            </SketchbookAuthor>
        </>
    );
}

export default ResultSketchbook;

const SketchbookAuthor = styled(Center)`
    width: 100%;
    height: 65px;
    position: relative;
    margin-top: 26px;
    color: ${({ theme }) => theme.color.whiteT2};
    font-size: ${({ theme }) => theme.typo.h2};

    svg {
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

const EmptySpan = styled.span`
    width: 30px;
    margin: 0 28px;
    transform: scale(1.3) translateY(2px);
`;

const ButtonWrapper = styled(Center)`
    display: flex;
    position: absolute;
    right: 0;
`;
