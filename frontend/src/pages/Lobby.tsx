import { useEffect, useRef } from 'react';
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
import { useRecoilState, useSetRecoilState } from 'recoil';
import { roundInfoState, userListState } from '@atoms/game';
import { getParam } from '@utils/common';
import { JoinLobbyReEmitRequest, JoinLobbyRequest } from '@backend/core/user.dto';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { onStartGame } from '@game/NetworkServiceUtils';
import { userMicCamState, userMicCamType } from '@atoms/user';

function Lobby() {
    const [userList, setUserList] = useRecoilState(userListState);
    const [userMicCam, setUserMicCam] = useRecoilState<userMicCamType>(userMicCamState);
    const [setPage] = useMovePage();
    const lobbyId = getParam('id');
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);

    const selfVideoRef = useRef<HTMLVideoElement>(null);
    const selfStreamRef = useRef<MediaStream | undefined>();
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection>();

    const setMicState = (curState: boolean) => {
        setUserMicCam({ ...userMicCam, isMicOn: curState });
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    };

    const setCamState = (curState: boolean) => {
        setUserMicCam({ ...userMicCam, isCamOn: curState });
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    };

    async function getMedia() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            selfStreamRef.current = stream;

            if (!selfVideoRef.current) return;
            selfVideoRef.current.srcObject = stream;

            selfStreamRef.current.getTracks().forEach((track) => {
                if (!pcRef.current || !selfStreamRef.current) return;
                pcRef.current.addTrack(track, selfStreamRef.current);
            });

            if (!pcRef.current) return;

            pcRef.current.onicecandidate = (e) => {
                if (e.candidate) {
                    console.log('recv candidate');
                    NetworkService.emit('ice', { ice: e.candidate, lobbyId });
                }
            };

            pcRef.current.ontrack = (e) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = e.streams[0];
                }
            };
        } catch (err) {
            console.log(err);
        }
    }

    const createOffer = async () => {
        if (!pcRef.current) return;
        try {
            const offer = await pcRef.current.createOffer();
            void pcRef.current.setLocalDescription(offer);
            NetworkService.emit('offer', { offer, lobbyId });
        } catch (e) {
            console.error(e);
        }
    };

    const createAnswer = async (sdp: RTCSessionDescription) => {
        console.log('createAnswer');
        if (!pcRef.current) return;

        try {
            void pcRef.current.setRemoteDescription(sdp);
            const answerSdp = await pcRef.current.createAnswer();
            void pcRef.current.setLocalDescription(answerSdp);
            NetworkService.emit('answer', { answerSdp, lobbyId });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        pcRef.current = new RTCPeerConnection();

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

        NetworkService.on('offer', (sdp: RTCSessionDescription) => {
            if (!pcRef.current) return;
            console.log('on offer');
            void createAnswer(sdp);
        });

        NetworkService.on('answer', (sdp: RTCSessionDescription) => {
            if (!pcRef.current) return;
            console.log('on answer');
            void pcRef.current.setRemoteDescription(sdp);
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        NetworkService.on('ice', async (ice: RTCIceCandidate) => {
            if (!pcRef.current) return;
            console.log('on ice');
            await pcRef.current.addIceCandidate(ice);
            console.log(pcRef.current);
        });

        void getMedia();

        return () => {
            NetworkService.off('leave-lobby');
            NetworkService.off('offer');
            NetworkService.off('answer');
            NetworkService.off('ice');
            if (pcRef.current) pcRef.current.close();
        };
    }, []);

    useEffect(() => {
        NetworkService.on('join-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserList([...userList, user.userName]);
            void createOffer();
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
                    <UserList />
                    <GameModeList lobbyId={lobbyId} />
                    <video ref={selfVideoRef}></video>
                </FlexBox>
                <ButtonWrapper>
                    <CameraButton setCamState={setCamState} />
                    <MicButton setMicState={setMicState} />
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
