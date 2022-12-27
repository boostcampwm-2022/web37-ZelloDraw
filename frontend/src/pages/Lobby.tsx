import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import SmallLogo from '@assets/zellodraw-logo.png';
import useLobbySocket from '@hooks/socket/useLobbySocket';
import useBeforeReload from '@hooks/useBeforeReload';
import useRemoveParams from '@hooks/useRemoveParams';
import { useResetGameState } from '@hooks/useResetGameState';
import GameModeList from '@components/GameModeList';
import UserList from '@components/UserList';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import SoundControlButton from '@components/SoundControlButton';
import ToasterFromTop from '@components/ToasterFromTop';

function Lobby() {
    const resetGameState = useResetGameState();
    const { emitStartGame } = useLobbySocket();
    useRemoveParams();
    useBeforeReload();

    useEffect(() => {
        resetGameState();
    }, []);

    const leaveLobbyByClickLogo = () => {
        location.reload();
    };

    return (
        <>
            <LogoWrapper
                onClick={leaveLobbyByClickLogo}
                role={'button'}
                aria-label={'게임 로비 나가기'}
            >
                <img src={SmallLogo} alt={'Logo'} width={363} height={75} />
            </LogoWrapper>
            <LobbyContainer>
                <FlexBox>
                    <UserList />
                    <GameModeList emitStartGame={emitStartGame} />
                </FlexBox>
                <ButtonWrapper>
                    <CameraButton />
                    <MicButton />
                </ButtonWrapper>
            </LobbyContainer>
            <SoundControlButtonWrapper>
                <SoundControlButton />
            </SoundControlButtonWrapper>
            <ToasterFromTop />
        </>
    );
}

export default Lobby;

const LobbyContainer = styled(ScaledSection)``;

const LogoWrapper = styled(ScaledDiv)`
    position: absolute;
    top: 12px;
    left: 12px;

    img {
        cursor: pointer;
    }
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

const SoundControlButtonWrapper = styled(ScaledDiv)`
    position: absolute;
    bottom: 24px;
    right: 26px;
`;
