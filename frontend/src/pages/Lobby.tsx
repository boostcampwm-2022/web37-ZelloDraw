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
import { roundInfoState, userStreamListState, WebRTCUser, lobbyIdState } from '@atoms/game';
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

function Lobby() {
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const [userStreamList, setUserStreamList] = useRecoilState<WebRTCUser[]>(userStreamListState);
    const [user, setUser] = useRecoilState(userState);
    const lobbyId = useRecoilValue(lobbyIdState);
    const [setPage] = useMovePage();
    const isNewLobby = getParam('new') === 'true' || getParam('new') === '';
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);
    const { createOffers } = useWebRTC();
    useRemoveParams();
    useBeforeReload();

    useEffect(() => {
        const payload: JoinLobbyRequest = { lobbyId };

        if (isNewLobby) {
            NetworkService.emit('update-user-stream', { video: userCam, audio: userMic });
            NetworkService.emit(
                'join-lobby',
                payload,
                (res: JoinLobbyResponse) => {
                    res.forEach((userInRoom) => {
                        void createOffers(userInRoom);
                    });
                },
                (err: SocketException) => {
                    alert(JSON.stringify(err.message));
                    setPage('/');
                },
            );
        }
        NetworkService.on('leave-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserStreamList((prev) =>
                prev.filter((participant) => participant.userName !== user.userName),
            );
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
        // NetworkService.on('join-lobby', (user: JoinLobbyReEmitRequest) => {
        //
        // });
        NetworkService.on('update-user-stream', (payload) => {
            setUserStreamList((prev) =>
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
        return () => {
            NetworkService.off('update-user-stream');
            NetworkService.off('join-lobby');
        };
    }, [userStreamList]);

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
