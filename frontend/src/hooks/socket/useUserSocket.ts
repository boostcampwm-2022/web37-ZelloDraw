import { networkServiceInstance as NetworkService } from '@services/socketService';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '@atoms/user';
import { userListState, WebRTCUser } from '@atoms/game';

function useUserSocket() {
    const [user, setUser] = useRecoilState(userState);
    const setUserList = useSetRecoilState<WebRTCUser[]>(userListState);

    function onSucceedHost() {
        NetworkService.on('succeed-host', () => {
            setUser({ ...user, isHost: true });
        });
    }

    function onUpdateUserStream() {
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
    }

    return { onSucceedHost, onUpdateUserStream };
}

export default useUserSocket;
