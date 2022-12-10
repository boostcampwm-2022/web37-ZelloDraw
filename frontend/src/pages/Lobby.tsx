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
import { roundInfoState, userListState, WebRTCUser, lobbyIdState } from '@atoms/game';
import { getParam } from '@utils/common';
import {
    JoinLobbyResponse,
    JoinLobbyRequest,
    JoinLobbyReEmitRequest,
} from '@backend/core/user.dto';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { onStartGame } from '@game/NetworkServiceUtils';
import useWebRTC from '@hooks/useWebRTC';
import useBeforeReload from '@hooks/useBeforeReload';
import useRemoveParams from '@hooks/useRemoveParams';
import { userCamState, userMicState, userState } from '@atoms/user';
import { useResetGameState } from '@hooks/useResetGameState';

function Lobby() {
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const [userList, setuserList] = useRecoilState<WebRTCUser[]>(userListState);
    const [user, setUser] = useRecoilState(userState);
    const lobbyId = useRecoilValue(lobbyIdState);
    const [setPage] = useMovePage();
    const isNewLobby = getParam('new') === 'true' || getParam('new') === '';
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);
    const { createOffers } = useWebRTC();
    const resetGameState = useResetGameState();

    useRemoveParams();
    useBeforeReload();

    useEffect(() => {
        resetGameState();
        const payload: JoinLobbyRequest = { lobbyId };

        if (isNewLobby) {
            NetworkService.emit('update-user-stream', { video: userCam, audio: userMic });
            NetworkService.emit(
                'join-lobby',
                payload,
                (res: JoinLobbyResponse) => {
                    setuserList(res.filter((cur) => cur.userName !== user.name));
                    res.forEach((userInRoom) => {
                        if (userInRoom.userName !== user.name) {
                            void createOffers(userInRoom);
                        }
                    });
                },
                (err: SocketException) => {
                    alert(JSON.stringify(err.message));
                    setPage('/');
                },
            );
        }

        NetworkService.on('succeed-host', () => {
            setUser({ ...user, isHost: true });
        });
        return () => {
            NetworkService.off('succeed-host');
        };
    }, []);

    useEffect(() => {
        NetworkService.on('join-lobby', (user: JoinLobbyReEmitRequest) => {
            setuserList([...userList, user]);
        });
        NetworkService.on('update-user-stream', (payload) => {
            setuserList((prev) =>
                prev.map((user) => {
                    const prevUserValue = { ...user };
                    if (payload.socketId === user.sid) {
                        prevUserValue.audio = payload.audio;
                        prevUserValue.video = payload.video;
                    }
                    return prevUserValue;
                }),
            );
        });
        NetworkService.on('leave-lobby', (user: JoinLobbyReEmitRequest) => {
            setuserList((prev) =>
                prev.filter((participant) => participant.userName !== user.userName),
            );
        });

        return () => {
            NetworkService.off('update-user-stream');
            NetworkService.off('join-lobby');
            NetworkService.off('leave-lobby');
        };
    }, [userList]);

    useEffect(() => {
        onStartGame(setPage, setRoundInfo);
    }, []);

    return (
        <>
            <LogoWrapper>
                <img src={SmallLogo} />
            </LogoWrapper>
            <LobbyContainer>
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
