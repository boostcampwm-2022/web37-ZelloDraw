import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { resetModalOpenState } from '@atoms/game';
import GameUsers from '@components/GameUsers';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import SmallLogo from '@assets/zellodraw-logo.png';
import GameSketchbook from '@components/GameSketchbook';
import ResultSketchbook from '@components/resultSketchbook/ResultSketchbook';
import useBeforeReload from '@hooks/useBeforeReload';
import CountDown from '@components/CountDown';
import { AnimatePresence } from 'framer-motion';
import ResetModal from '@components/ResetModal';
import SoundControlButton from '@components/SoundControlButton';
import countdownSound from '@assets/sounds/countdown.mp3';
import useSoundEffect from '@hooks/useSoundEffect';
import useGameSocket from '@hooks/socket/useGameSocket';

function Game() {
    const [isCompleteGame, setIsCompleteGame] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const resetModalOpen = useRecoilValue(resetModalOpenState);
    const { playSoundEffect } = useSoundEffect();
    useBeforeReload();
    const { emitSubmitQuizReply } = useGameSocket(setIsCompleteGame);

    useEffect(() => {
        playSoundEffect(countdownSound);
        setTimeout(() => setIsStarted(true), 2500);
    }, []);

    return (
        <>
            <AnimatePresence>{!isStarted && <CountDown />}</AnimatePresence>
            <Container>
                <GameUsers />
                <SketchbookSection>
                    {isCompleteGame ? (
                        <ResultSketchbook isForShareResult={false} />
                    ) : (
                        <GameSketchbook emitSubmitQuizReply={emitSubmitQuizReply} />
                    )}
                </SketchbookSection>
                {resetModalOpen && <ResetModal />}
            </Container>
            <CamAndMicWrapper>
                <CameraButton />
                <MicButton />
            </CamAndMicWrapper>
            <LogoWrapper>
                <img src={SmallLogo} alt={'Logo'} width={363} height={75} />
            </LogoWrapper>
            <SoundControlButtonWrapper>
                <SoundControlButton />
            </SoundControlButtonWrapper>
        </>
    );
}

export default Game;

const Container = styled(ScaledSection)`
    position: relative;
    padding: 48px 36px 40px 36px;
`;

const SketchbookSection = styled.div`
    margin-bottom: 140px;
`;

const CamAndMicWrapper = styled(ScaledDiv)`
    display: flex;
    position: absolute;
    bottom: 24px;
    left: 26px;

    > button {
        margin-right: 16px;
    }
`;

const LogoWrapper = styled(ScaledDiv)`
    justify-self: center;
    position: absolute;
    bottom: 40px;
    cursor: pointer;
`;

const SoundControlButtonWrapper = styled(ScaledDiv)`
    position: absolute;
    bottom: 24px;
    right: 26px;
`;
