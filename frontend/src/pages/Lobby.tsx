import React from 'react';
import styled from 'styled-components';
import GameModeList from '@components/GameModeList';
import UserList from '@components/UserList';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import SmallLogo from '@components/logo/SmallLogo';

function Lobby() {
    return (
        <>
            <LobbyContainer>
                <LogoWrapper>
                    <SmallLogo />
                </LogoWrapper>
                <FlexBox>
                    <UserList />
                    <GameModeList />
                </FlexBox>
                <ButtonWrapper>
                    <CameraButton />
                    <MicButton />
                </ButtonWrapper>
            </LobbyContainer>
        </>
    );
}

export default Lobby;

const LogoWrapper = styled.div`
    position: absolute;
    top: 12px;
    left: 24px;
`;

const LobbyContainer = styled.section`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const FlexBox = styled.div`
    display: flex;
    gap: 14px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    margin-left: -590px;
`;
