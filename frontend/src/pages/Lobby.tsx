import { useEffect } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { roundInfoState, userListState, userStreamListState } from '@atoms/game';
import { getParam } from '@utils/common';
import { JoinLobbyReEmitRequest, JoinLobbyRequest } from '@backend/core/user.dto';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { onStartGame } from '@game/NetworkServiceUtils';
import useWebRTC from '@hooks/useWebRTC';
import { userState } from '@atoms/user';
import useBeforeReload from '@hooks/useBeforeReload';
import useLobbyId from '@hooks/useLobbyId';

function Lobby() {
    const [user, setUser] = useRecoilState(userState);
    const userStreamList = useRecoilValue(userStreamListState);
    const [userList, setUserList] = useRecoilState(userListState);
    const [lobbyId, setLobbyId] = useLobbyId();
    const [setPage] = useMovePage();
    const isNewLobby = getParam('new') === 'true' || getParam('new') === '';
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);
    const { createOffers } = useWebRTC();
    useBeforeReload();

    useEffect(() => {
        setLobbyId(lobbyId);
        const payload: JoinLobbyRequest = { lobbyId };
        if (isNewLobby) {
            NetworkService.emit(
                'join-lobby',
                payload,
                (res: Array<{ userName: string; sid: string }>) => {
                    setUserList(res);
                    res.forEach((userInRoom) => {
                        setTimeout(() => {
                            if (user.name !== userInRoom.userName) {
                                console.log('send offer from newbie');
                                void createOffers(userInRoom);
                            }
                        }, 100);
                    });
                },
                (err: SocketException) => {
                    alert(JSON.stringify(err.message));
                    setPage('/');
                },
            );
        }
        NetworkService.on('leave-lobby', (users: Array<{ userName: string; sid: string }>) => {
            setUserList(users);
        });
        NetworkService.on('succeed-host', () => {
            setUser({ ...user, isHost: true });
        });
        return () => {
            NetworkService.off('leave-lobby');
            NetworkService.off('succeed-host');
        };
    }, []);

    useEffect(() => {
        NetworkService.on('join-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserList([...userList, user]);
        });
        return () => {
            NetworkService.off('join-lobby');
        };
    }, [userList]);

    useEffect(() => {
        onStartGame(setPage, setRoundInfo);
    }, []);

    return (
        <>
            <LogoWrapper onClick={() => setPage('/')}>
                <img src={SmallLogo} />
            </LogoWrapper>
            <LobbyContainer>
                <FlexBox>
                    <UserList userStreamList={userStreamList} />
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
