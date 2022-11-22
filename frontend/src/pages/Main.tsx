import React, { useEffect } from 'react';
import styled from 'styled-components';
import UserCard from '@components/UserCard';
import Logo from '@assets/logo-l.png';
import InfoCard from '@components/InfoCard';
import GuestEntranceMessage from '@components/GuestMessageBox';
import MadeByText from '@components/MadeByText';
import useMovePage from '@hooks/useMovePage';
import { useRecoilValue } from 'recoil';
import { userState, userStateType } from '@atoms/user';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { getParam } from '@utils/common';
import { ScaledSection } from '@styles/styled';

function Main() {
    const [setPage] = useMovePage();
    const user = useRecoilValue<userStateType>(userState);
    const lobbyId = getParam('id');

    useEffect(() => {
        NetworkService.emit('update-user-name', user.name);
    }, []);

    const onClickEnterBtn = () => {
        if (user.isHost) {
            NetworkService.emit('create-lobby', { userName: user.name }, (res: string) => {
                setPage(`/lobby?id=${res}`);
            });
        } else {
            setPage(`/lobby?id=${lobbyId}`);
        }
    };

    return (
        <>
            <MainContainer>
                <LogoWrapper onClick={() => setPage('/')}>
                    <img src={Logo} alt={'Logo, Move to main page'} />
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

const BottomWrapper = styled.div`
    position: absolute;
    bottom: 20px;
    right: 16px;
`;
