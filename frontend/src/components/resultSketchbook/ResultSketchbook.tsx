import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { canOneMoreGameState, gameResultIdState, isStartedState } from '@atoms/result';
import { lobbyIdState } from '@atoms/game';
import { ReactComponent as ExportIcon } from '@assets/icons/export-icon.svg';
import resultInSound from '@assets/sounds/result-in.wav';
import { networkServiceInstance as NetworkService } from '@services/socketService';
import useMovePage from '@hooks/useMovePage';
import useCheckGuidePage from '@hooks/useCheckGuidePage';
import useCopyClipBoard from '@hooks/useCopyClipboard';
import useSoundEffect from '@hooks/useSoundEffect';
import SketchbookCard from '@components/SketchbookCard';
import ResultGuide from '@components/resultSketchbook/ResultGuide';
import QuizResultContent from '@components/resultSketchbook/QuizResultContent';
import QuizAuthor from '@components/resultSketchbook/QuizAuthor';
import CurSketchbookPage from '@components/resultSketchbook/CurSketchbookPage';
import SketchbookAuthor from '@components/resultSketchbook/SketchbookAuthor';
import OneMoreGameButton from '@components/resultSketchbook/OneMoreGameButton';
import useResultSketchbook from '@hooks/useResultSketchbook';

function ResultSketchbook({ isForShareResult }: { isForShareResult: boolean }) {
    const [setPage] = useMovePage();
    const lobbyId = useRecoilValue(lobbyIdState);
    const gameResultId = useRecoilValue(gameResultIdState);

    const isStarted = useRecoilValue(isStartedState);
    const canOneMoreGame = useRecoilValue(canOneMoreGameState);

    const { checkIsNotGuidePage } = useCheckGuidePage();
    const [_, onCopy] = useCopyClipBoard();
    const { playSoundEffect } = useSoundEffect();
    useResultSketchbook(isForShareResult);

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
            <OutsideOfCard>
                {!isStarted && (
                    <>
                        <SketchbookAuthor isForShareResult={isForShareResult} />
                        <ButtonWrapper>
                            {(isForShareResult || canOneMoreGame) && (
                                <ExportIcon
                                    onClick={copyGameResultIdOnClipboard}
                                    role={'button'}
                                    aria-label={'게임 결과 페이지 링크 복사'}
                                />
                            )}
                            <OneMoreGameButton isForShareResult={isForShareResult} />
                        </ButtonWrapper>
                    </>
                )}
            </OutsideOfCard>
        </>
    );
}

export default ResultSketchbook;

const OutsideOfCard = styled(Center)`
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

const ButtonWrapper = styled(Center)`
    display: flex;
    position: absolute;
    right: 0;
`;
