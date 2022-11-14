import React from 'react';
import styled from 'styled-components';
import MainLogo from '@components/MainLogo';
import UserCard from '@components/UserCard';
import InfoCard from '@components/InfoCard';
import GuestEntranceMessage from '@components/GuestMessageBox';
import MadeByText from '@components/MadeByText';

function Main() {
    return (
        <MainContainer>
            <FlexBox>
                <MainLogo />
                <CardContainer>
                    <UserCard />
                    <InfoCard />
                </CardContainer>
                <GuestEntranceMessage />
            </FlexBox>
            <MadeByText />
        </MainContainer>
    );
}

export default Main;

const MainContainer = styled.section`
    display: flex;
    height: 100%;
    flex-direction: column;
`;

const FlexBox = styled.section`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
`;

const CardContainer = styled.div`
    display: flex;
    gap: 19px;
`;
