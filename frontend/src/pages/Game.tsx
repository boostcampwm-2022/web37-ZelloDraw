import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import { onCompleteGame, onCountSubmittedQuiz } from '@game/NetworkServiceUtils';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { gameResultState } from '@atoms/result';
import { userListState } from '@atoms/game';
import GameUsers from '@components/GameUsers';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import useMovePage from '@hooks/useMovePage';
import SmallLogo from '@assets/logo-s.png';
import GameSketchbook from '@components/GameSketchbook';
import ResultSketchbook from '@components/ResultSketchbook';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';
import { userState } from '@atoms/user';
import useBeforeReload from '@hooks/useBeforeReload';
import { useResetGameState } from '@hooks/useResetGameState';

function Game() {
    const [user, setUser] = useRecoilState(userState);
    const [setPage] = useMovePage();
    const setGameResult = useSetRecoilState(gameResultState);
    const [isCompleteGame, setIsCompleteGame] = useState(false);
    const [userList, setUserList] = useRecoilState(userListState);
    const resetGameState = useResetGameState();
    useBeforeReload();

    useEffect(() => {
        resetGameState();
        onCountSubmittedQuiz();
        onCompleteGame(setGameResult, setIsCompleteGame);

        NetworkService.on('leave-game', (user: JoinLobbyReEmitRequest) => {
            setUserList(userList.filter((participant) => participant.userName !== user.userName));
        });

        NetworkService.on('succeed-host', () => {
            setUser({ ...user, isHost: true });
        });

        return () => {
            NetworkService.off('leave-lobby');
            NetworkService.off('succeed-host');
        };
    }, []);

    return (
        <>
            <Container>
                <GameUsers />
                <SketchbookSection>
                    {isCompleteGame ? <ResultSketchbook /> : <GameSketchbook />}
                </SketchbookSection>
            </Container>
            <CamAndMicWrapper>
                <CameraButton />
                <MicButton />
            </CamAndMicWrapper>
            <LogoWrapper onClick={() => setPage('/')}>
                <img src={SmallLogo} />
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
