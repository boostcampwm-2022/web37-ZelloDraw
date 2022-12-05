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
import { roundInfoState, userStreamListState, WebRTCUser } from '@atoms/game';
import { getParam } from '@utils/common';
import {
    JoinLobbyReEmitRequest,
    JoinLobbyRequest,
    JoinLobbyResponse,
} from '@backend/core/user.dto';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { onStartGame } from '@game/NetworkServiceUtils';
import useWebRTC from '@hooks/useWebRTC';
import { userCamState, userMicState, userState } from '@atoms/user';

function Lobby() {
    const curUser = useRecoilValue(userState);
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);
    const [userStreamList, setUserStreamList] = useRecoilState<WebRTCUser[]>(userStreamListState);

    const lobbyId = getParam('id');
    const [setPage] = useMovePage();
    const { createOffers } = useWebRTC();

    useEffect(() => {
        const payload: JoinLobbyRequest = { lobbyId };
        NetworkService.emit(
            'join-lobby',
            payload,
            (res: JoinLobbyResponse) => {
                res.forEach((userInRoom) => {
                    setTimeout(() => {
                        if (curUser.name !== userInRoom.userName) {
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
        NetworkService.emit('update-user-stream', { video: userCam, audio: userMic });
        NetworkService.on('leave-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserStreamList((prev) =>
                prev.filter((participant) => participant.userName !== user.userName),
            );
        });
        return () => {
            NetworkService.off('leave-lobby');
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
            NetworkService.off('join-lobby');
        };
    }, [userStreamList]);

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
