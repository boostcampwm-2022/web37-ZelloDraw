import { useEffect } from 'react';
import styled from 'styled-components';
import GameModeList from '@components/GameModeList';
import UserList from '@components/UserList';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import SmallLogo from '@assets/logo-s.png';
import useMovePage from '@hooks/useMovePage';
import {
    networkServiceInstance as NetworkService,
    SocketException,
} from '../services/socketService';
import { useRecoilState } from 'recoil';
import { userListState } from '@atoms/game';
import { getParam } from '@utils/common';
import { JoinLobbyReEmitRequest, JoinLobbyRequest } from '@backend/core/user.dto';
import { ScaledSection } from '@styles/styled';

function Lobby() {
    const [userList, setUserList] = useRecoilState(userListState);
    const [setPage] = useMovePage();
    const lobbyId = getParam('id');

    useEffect(() => {
        const payload: JoinLobbyRequest = { lobbyId };
        NetworkService.emit(
            'join-lobby',
            payload,
            (res: Array<{ userName: string }>) => {
                const data = res.map((user) => user.userName);
                setUserList(data);
            },
            (err: SocketException) => {
                alert(JSON.stringify(err.message));
                setPage('/');
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
        NetworkService.on('join-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserList([...userList, user.userName]);
        });
        return () => {
            NetworkService.off('join-lobby');
        };
    }, [userList]);

    return (
        <>
            <LobbyContainer>
                <LogoWrapper onClick={() => setPage('/')}>
                    <img src={SmallLogo} />
                </LogoWrapper>
                <FlexBox>
                    <UserList />
                    <GameModeList lobbyId={lobbyId} />
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

const LobbyContainer = styled(ScaledSection)``;

const LogoWrapper = styled.div`
    position: absolute;
    top: 12px;
    left: 24px;

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
