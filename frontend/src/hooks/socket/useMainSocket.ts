import { networkServiceInstance as NetworkService } from '@services/socketService';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userCamState, userMicState, userStateType } from '@atoms/user';
import { lobbyIdState } from '@atoms/game';

function useMainSocket({ user, setPage }: { user: userStateType; setPage: (url: string) => void }) {
    const [lobbyId, setLobbyId] = useRecoilState(lobbyIdState);
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);

    useEffect(() => {
        NetworkService.emit('update-user-name', user.name);
    }, []);

    useEffect(() => {
        if (userCam !== undefined && userMic !== undefined) {
            NetworkService.emit('update-user-stream', { video: userCam, audio: userMic });
        }
    }, [userCam, userMic]);

    function enterLobby() {
        if (user.isHost) {
            NetworkService.emit('create-lobby', { userName: user.name }, (res: string) => {
                setLobbyId(res);
                setPage(`/lobby?id=${res}`);
            });
        } else {
            setPage(`/lobby?id=${lobbyId}`);
        }
    }

    function emitUpdateUserName(name: string) {
        NetworkService.emit('update-user-name', name);
    }

    return { enterLobby, emitUpdateUserName };
}

export default useMainSocket;
