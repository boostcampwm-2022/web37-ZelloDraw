import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import { onCompleteGame, onCountSubmittedQuiz } from '@game/NetworkServiceUtils';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { gameResultIdState, gameResultState } from '@atoms/result';
import { resetModalOpenState, submittedQuizReplyCountState, userListState } from '@atoms/game';
import GameUsers from '@components/GameUsers';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import SmallLogo from '@assets/logo-s.png';
import GameSketchbook from '@components/GameSketchbook';
import ResultSketchbook from '@components/ResultSketchbook';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';
import { userState } from '@atoms/user';
import useBeforeReload from '@hooks/useBeforeReload';
import CountDown from '@components/CountDown';
import { AnimatePresence } from 'framer-motion';
import ResetModal from '@components/ResetModal';

function Game() {
    const [user, setUser] = useRecoilState(userState);
    const setGameResult = useSetRecoilState(gameResultState);
    const setGameResultId = useSetRecoilState(gameResultIdState);
    const setUserList = useSetRecoilState(userListState);
    const setSubmittedQuizReplyCount = useSetRecoilState(submittedQuizReplyCountState);
    const [isCompleteGame, setIsCompleteGame] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const resetModalOpen = useRecoilValue(resetModalOpenState);
    useBeforeReload();

    useEffect(() => {
        setTimeout(() => setIsStarted(true), 2500);
    }, []);

    useEffect(() => {
        onCountSubmittedQuiz(setSubmittedQuizReplyCount);
        onCompleteGame(setGameResultId, setGameResult, setIsCompleteGame);

        NetworkService.on('update-user-stream', (payload) => {
            setuserList((prev) =>
                prev.map((user) => {
                    const prevUserValue = { ...user };
                    if (payload.socketId === user.sid) {
                        prevUserValue.audio = payload.audio;
                        prevUserValue.video = payload.video;
                    }
                    return prevUserValue;
                }),
            );
        });

        NetworkService.on('leave-game', (user: JoinLobbyReEmitRequest) => {
            setUserList((prev) =>
                prev.filter((participant) => participant.userName !== user.userName),
            );
        });

        NetworkService.on('succeed-host', () => {
            setUser({ ...user, isHost: true });
        });

        return () => {
            NetworkService.off('update-user-stream');
            NetworkService.off('leave-game');
            NetworkService.off('succeed-host');
        };
    }, [isStarted]);

    return (
        <>
            <AnimatePresence>{!isStarted && <CountDown />}</AnimatePresence>
            <Container>
                <GameUsers />
                <SketchbookSection>
                    {isCompleteGame ? (
                        <ResultSketchbook isForShareResult={false} />
                    ) : (
                        <GameSketchbook />
                    )}
                </SketchbookSection>
                {resetModalOpen && <ResetModal />}
            </Container>
            <CamAndMicWrapper>
                <CameraButton />
                <MicButton />
            </CamAndMicWrapper>
            <LogoWrapper>
                <img src={SmallLogo} alt={'Logo'} />
            </LogoWrapper>
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
