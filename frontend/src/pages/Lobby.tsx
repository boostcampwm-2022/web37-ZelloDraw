import { useEffect } from 'react';
import styled from 'styled-components';
import GameModeList from '@components/GameModeList';
import UserList from '@components/UserList';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import { ReactComponent as SmallLogo } from '@assets/logo-s.svg';
import useMovePage from '@hooks/useMovePage';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '@atoms/user';
import { userListState } from '@atoms/game';
import { getParam } from '@utils/common';

function Lobby() {
    const [userList, setUserList] = useRecoilState(userListState);
    const user = useRecoilValue(userState);
    const [setPage] = useMovePage();

    useEffect(() => {
        const lobbyId = getParam('id');
        NetworkService.emit(
            'join-lobby',
            { userName: user.name, lobbyId },
            (res: Array<{ userName: string }>) => {
                const data = res.map((user) => user.userName);
                setUserList(data);
            },
        );
        NetworkService.on('leave-lobby', (users: Array<{ userName: string }>) => {
            setUserList(users.map((user) => user.userName));
        });

        return () => {
            NetworkService.off('leave-lobby');
        };
    }, []);

    useEffect(() => {
        NetworkService.on('join-lobby', (user: { userName: string }) => {
            setUserList([...userList, user.userName]);
        });
        return () => {
            NetworkService.off('join-lobby');
        };
    }, [userList]);

    return (
        <>
            <LobbyContainer>
                <LogoWrapper>
                    <SmallLogo style={{ cursor: 'pointer' }} onClick={() => setPage('/')} />
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
