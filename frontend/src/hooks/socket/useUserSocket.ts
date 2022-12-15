import { networkServiceInstance as NetworkService } from '@services/socketService';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userCamState, userMicState, userState } from '@atoms/user';
import { userListState, WebRTCUser } from '@atoms/game';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';

interface DeviceType {
    audio?: boolean;
    video?: boolean;
}

function useUserSocket() {
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const [user, setUser] = useRecoilState(userState);
    const setUserList = useSetRecoilState<WebRTCUser[]>(userListState);

    function onSucceedHost() {
        NetworkService.on('succeed-host', (hostInfo: JoinLobbyReEmitRequest) => {
            setUserList((prev) =>
                prev.map((user: WebRTCUser) => {
                    const prevUserValue = { ...user };
                    prevUserValue.isHost = user.sid === hostInfo.sid;
                    return prevUserValue;
                }),
            );
            user.name === hostInfo.userName && setUser({ ...user, isHost: true });
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

    function emitUpdateUserStream(values?: DeviceType) {
        NetworkService.emit('update-user-stream', {
            video: values?.video ?? userCam,
            audio: values?.audio ?? userMic,
        });
    }

    return { onSucceedHost, onUpdateUserStream, emitUpdateUserStream };
}

export default useUserSocket;
