import React from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { userState, userStateType } from '@atoms/user';
import Logo from '@assets/zellodraw-logo.png';
import UserCard from '@components/UserCard';
import InfoCard from '@components/InfoCard';
import GuestEntranceMessage from '@components/GuestMessageBox';
import MadeByText from '@components/MadeByText';
import useMovePage from '@hooks/useMovePage';
import useMainSocket from '@hooks/socket/useMainSocket';
import GitHubIconButton from '@components/GitHubIconButton';

function Main() {
    const [setPage] = useMovePage();
    const user = useRecoilValue<userStateType>(userState);
    const { enterLobby, emitUpdateUserName } = useMainSocket({ user, setPage });

    return (
        <>
            <MainContainer>
                <LogoWrapper
                    onClick={() => setPage('/')}
                    role={'button'}
                    aria-label={'새로고침을 위해 메인화면으로 이동'}
                >
                    <img src={Logo} alt={'Logo'} width={554} height={124} />
                </LogoWrapper>
                <CardContainer>
                    <UserCard emitUpdateUserName={emitUpdateUserName} />
                    <InfoCard onHandleEnterLobby={enterLobby} />
                </CardContainer>
                {!user.isHost && <GuestEntranceMessage />}
            </MainContainer>
            <BottomWrapper>
                <GitHubIconButton />
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
    bottom: 18px;
    left: 24px;
    right: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
