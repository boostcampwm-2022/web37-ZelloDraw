import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import UserCard from '@components/UserCard';
import Logo from '@assets/logo-l.png';
import InfoCard from '@components/InfoCard';
import GuestEntranceMessage from '@components/GuestMessageBox';
import MadeByText from '@components/MadeByText';
import useMovePage from '@hooks/useMovePage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userCamState, userMicState, userState, userStateType } from '@atoms/user';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { lobbyIdState } from '@atoms/game';

function Main() {
    const [setPage] = useMovePage();
    const user = useRecoilValue<userStateType>(userState);
    const [lobbyId, setLobbyId] = useRecoilState(lobbyIdState);
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);

    useEffect(() => {
        NetworkService.emit('update-user-name', user.name);
    }, []);

    useEffect(() => {
        if (userCam !== undefined && userMic !== undefined) {
            NetworkService.emit('update-user-stream', { video: userCam, audio: userMic });
        }
    }, [userCam, userMic]);

    const onClickEnterBtn = () => {
        if (user.isHost) {
            NetworkService.emit('create-lobby', { userName: user.name }, (res: string) => {
                setLobbyId(res);
                setPage(`/lobby?id=${res}`);
            });
        } else {
            setPage(`/lobby?id=${lobbyId}`);
        }
    };

    return (
        <>
            <MainContainer>
                <LogoWrapper
                    onClick={() => setPage('/')}
                    role={'button'}
                    aria-label={'새로고침을 위해 메인화면으로 이동'}
                >
                    <img src={Logo} alt={'Logo'} />
                </LogoWrapper>
                <CardContainer>
                    <UserCard />
                    <InfoCard onHandleEnterLobby={onClickEnterBtn} />
                </CardContainer>
                {!user.isHost && <GuestEntranceMessage />}
            </MainContainer>
            <BottomWrapper>
                <MadeByText />
            </BottomWrapper>
        </>
    );
}

export default Main;

const MainContainer = styled(ScaledSection)`
    margin-top: -120px;
    gap: 16px;
`;

const CardContainer = styled.div`
    display: flex;
    gap: 19px;
`;

const LogoWrapper = styled.div`
    cursor: pointer;
`;

const BottomWrapper = styled(ScaledDiv)`
    position: absolute;
    bottom: 20px;
    right: 16px;
`;
