import React from 'react';
import styled from 'styled-components';
import MainLogo from '@components/logo/MainLogo';
import UserCard from '@components/UserCard';
import InfoCard from '@components/InfoCard';
import GuestEntranceMessage from '@components/GuestMessageBox';
import MadeByText from '@components/MadeByText';

function Main() {
    return (
        <MainContainer>
            <CardContainer>
                <UserCard />
                <InfoCard />
            </CardContainer>
            <GuestEntranceMessage />
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
