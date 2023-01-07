import { networkServiceInstance as NetworkService } from '@services/socketService';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userCamState, userMicState, userStateType, userStreamRefState } from '@atoms/user';
import { lobbyIdState } from '@atoms/game';
import useUserSocket from '@hooks/socket/useUserSocket';

function useMainSocket({ user, setPage }: { user: userStateType; setPage: (url: string) => void }) {
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const [lobbyId, setLobbyId] = useRecoilState(lobbyIdState);
    const { emitUpdateUserStream } = useUserSocket();
    const selfStreamRef = useRecoilValue(userStreamRefState);

    useEffect(() => {
        NetworkService.emit('update-user-name', user.name);
    }, []);

    useEffect(() => {
        if (userCam !== undefined && userMic !== undefined) {
            emitUpdateUserStream();
        }
    }, [userCam, userMic]);

    function enterLobby() {
        if (selfStreamRef === undefined) return;
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
