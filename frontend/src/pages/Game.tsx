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
import usePreventClose from '@hooks/usePreventClose';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';

function Game() {
    const [setPage] = useMovePage();
    const setGameResult = useSetRecoilState(gameResultState);
    const [isCompleteGame, setIsCompleteGame] = useState(false);
    const [userList, setUserList] = useRecoilState(userListState);

    usePreventClose();

    useEffect(() => {
        onCountSubmittedQuiz();
        onCompleteGame(setGameResult, setIsCompleteGame);

        NetworkService.on('leave-game', (user: JoinLobbyReEmitRequest) => {
            setUserList(userList.filter((participant) => participant !== user.userName));
        });

        return () => {
            NetworkService.off('leave-lobby');
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
