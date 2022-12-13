import { networkServiceInstance as NetworkService } from '@services/socketService';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userStateType } from '@atoms/user';
import { lobbyIdState } from '@atoms/game';
import useUserSocket from '@hooks/socket/useUserSocket';

function useMainSocket({ user, setPage }: { user: userStateType; setPage: (url: string) => void }) {
    const [lobbyId, setLobbyId] = useRecoilState(lobbyIdState);
    const { emitUpdateUserStream } = useUserSocket();

    useEffect(() => {
        NetworkService.emit('update-user-name', user.name);
        emitUpdateUserStream();
    }, []);

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
