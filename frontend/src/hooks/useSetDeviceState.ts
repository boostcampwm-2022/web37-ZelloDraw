import { userCamState, userMicState, localDeviceState } from '@atoms/user';
import { useSetRecoilState, useRecoilState } from 'recoil';

function useSetDeviceState() {
    const setUserCam = useSetRecoilState<boolean>(userCamState);
    const setUserMic = useSetRecoilState<boolean>(userMicState);
    const [localDevices, setLocalDevices] = useRecoilState(localDeviceState);

    const setMicDeviceInfo = (audio: boolean) => {
        setLocalDevices({ ...localDevices, audio });
        setUserMic(audio);
    };

    const setCamDeviceInfo = (video: boolean) => {
        setLocalDevices({ ...localDevices, video });
        setUserCam(video);
    };

    return { setMicDeviceInfo, setCamDeviceInfo };
}

export default useSetDeviceState;
