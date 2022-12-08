import { userCamState, userMicState, ConstraintsType, localDeviceState } from '@atoms/user';
import { useSetRecoilState } from 'recoil';

function useSetDeviceState() {
    const setUserCam = useSetRecoilState<boolean>(userCamState);
    const setUserMic = useSetRecoilState<boolean>(userMicState);
    const setLocalDevices = useSetRecoilState(localDeviceState);

    const setDeviceInfo = ({ audio, video }: ConstraintsType) => {
        setLocalDevices({ audio, video });
        setUserCam(audio);
        setUserMic(video);
    };

    return setDeviceInfo;
}

export default useSetDeviceState;
