import { networkServiceInstance as NetworkService, SocketException } from '@services/socketService';
import { useEffect } from 'react';
import {
    JoinLobbyReEmitRequest,
    JoinLobbyRequest,
    JoinLobbyResponse,
} from '@backend/core/user.dto';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userCamState, userMicState, userState } from '@atoms/user';
import { lobbyIdState, roundInfoState, userListState, WebRTCUser } from '@atoms/game';
import { getParam } from '@utils/common';
import useMovePage from '@hooks/useMovePage';
import useWebRTC from '@hooks/useWebRTC';
import useSoundEffect from '@hooks/useSoundEffect';
import useUserSocket from '@hooks/socket/useUserSocket';
import lobbyInSound from '@assets/sounds/lobby-in.mp3';

function useLobbySocket() {
    const isNewLobby = getParam('new') === 'true' || getParam('new') === '';
    const lobbyId = useRecoilValue(lobbyIdState);
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const user = useRecoilValue(userState);
    const [userList, setUserList] = useRecoilState<WebRTCUser[]>(userListState);
    const [setPage] = useMovePage();
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);
    const { createOffers } = useWebRTC();
    const { playSoundEffect } = useSoundEffect();

    const { onSucceedHost, onUpdateUserStream } = useUserSocket();

    useEffect(() => {
        if (isNewLobby) {
            emitUpdateUserStream();
            emitJoinLobby();
        }

        onSucceedHost();
        onStartGame();

        return () => {
            NetworkService.off('succeed-host');
            NetworkService.off('start-game');
        };
    }, []);

    useEffect(() => {
        onJoinLobby();
        onLeaveLobby();
        onUpdateUserStream();

        return () => {
            NetworkService.off('join-lobby');
            NetworkService.off('leave-lobby');
            NetworkService.off('update-user-stream');
        };
    }, [userList]);

    function emitUpdateUserStream() {
        NetworkService.emit('update-user-stream', { video: userCam, audio: userMic });
    }

    function emitJoinLobby() {
        const payload: JoinLobbyRequest = { lobbyId };

        NetworkService.emit(
            'join-lobby',
            payload,
            (res: JoinLobbyResponse) => {
                setUserList(res.filter((cur) => cur.userName !== user.name));
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

    /*    function onSucceedHost() {
        NetworkService.on('succeed-host', () => {
            setUser({ ...user, isHost: true });
        });
    } */

    function onStartGame() {
        NetworkService.on('start-game', () => {
            setPage('/game');
        });

        NetworkService.on('start-round', (roundInfo: StartRoundEmitRequest) => {
            setRoundInfo(roundInfo);
        });
    }

    function onJoinLobby() {
        NetworkService.on('join-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserList([...userList, user]);
            playSoundEffect(lobbyInSound);
        });
    }

    function onLeaveLobby() {
        NetworkService.on('leave-lobby', (user: JoinLobbyReEmitRequest) => {
            setUserList((prev) =>
                prev.filter((participant) => participant.userName !== user.userName),
            );
        });
    }

    /*    function onUpdateUserStream() {
        NetworkService.on('update-user-stream', (payload) => {
            setUserList((prev) =>
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
    } */

    function emitStartGame() {
        NetworkService.emit('start-game', lobbyId);
    }

    return { emitStartGame };
}

export default useLobbySocket;
