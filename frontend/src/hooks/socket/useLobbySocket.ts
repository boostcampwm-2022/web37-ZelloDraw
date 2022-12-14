import { networkServiceInstance as NetworkService, SocketException } from '@services/socketService';
import { useEffect } from 'react';
import {
    JoinLobbyReEmitRequest,
    JoinLobbyRequest,
    JoinLobbyResponse,
} from '@backend/core/user.dto';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '@atoms/user';
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
    const user = useRecoilValue(userState);
    const setUserList = useSetRecoilState<WebRTCUser[]>(userListState);
    const [setPage] = useMovePage();
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);
    const { createOffers } = useWebRTC();
    const { playSoundEffect } = useSoundEffect();
    const userList = useRecoilValue(userListState);

    const { onSucceedHost, emitUpdateUserStream, onUpdateUserStream } = useUserSocket();

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
        onUpdateUserStream();
        onLeaveLobby();

        return () => {
            NetworkService.off('join-lobby');
            NetworkService.off('leave-lobby');
            NetworkService.off('update-user-stream');
        };
    }, [userList]);

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
            setUserList((userList) => [...userList, user]);
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

    function emitStartGame() {
        NetworkService.emit('start-game', lobbyId);
    }

    return { emitStartGame };
}

export default useLobbySocket;
