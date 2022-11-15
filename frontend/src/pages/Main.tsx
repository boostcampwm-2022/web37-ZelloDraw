import React from 'react';
import styled from 'styled-components';
import UserCard from '@components/UserCard';
import { ReactComponent as MainLogo } from '@assets/logo-l.svg';
import InfoCard from '@components/InfoCard';
import GuestEntranceMessage from '@components/GuestMessageBox';
import MadeByText from '@components/MadeByText';
import useMovePage from '@hooks/useMovePage';
import { useRecoilValue } from 'recoil';
import { userState } from '@atoms/user';

function Main() {
    const [setPage] = useMovePage();
    const user = useRecoilValue(userState);

    return (
        <MainContainer>
            <MainLogo style={{ cursor: 'pointer' }} onClick={() => setPage('/')} />
            <CardContainer>
                <UserCard />
                <InfoCard />
            </CardContainer>
            {!user.isHost && <GuestEntranceMessage />}
            <LogoWrapper>
                <MadeByText />
            </LogoWrapper>
        </MainContainer>
    );
}

export default Main;

const MainContainer = styled.section`
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
`;

const CardContainer = styled.div`
    display: flex;
    gap: 19px;
`;

const LogoWrapper = styled.div`
    position: absolute;
    bottom: 0px;
    right: 0px;
`;
