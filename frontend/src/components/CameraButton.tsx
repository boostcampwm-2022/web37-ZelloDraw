import cameraOffImg from '@assets/buttons/camera-off-btn.svg';
import cameraOnImg from '@assets/buttons/camera-on-btn.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userMicState, userCamState, userStreamRefState, localDeviceState } from '@atoms/user';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import ControlButton from '@components/ControlButton';

function CameraButton() {
    const selfStreamRef = useRecoilValue(userStreamRefState);
    const userMic = useRecoilValue(userMicState);
    const [userCam, setUserCam] = useRecoilState(userCamState);
    const localCamState = useRecoilValue(localDeviceState).video;
    const onBtnClick = () => {
        if (!selfStreamRef?.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));

        const changed = !userCam;
        setUserCam(changed);
        NetworkService.emit('update-user-stream', { audio: userMic, video: changed });
    };

    return (
        <ControlButton
            onClick={onBtnClick}
            disabled={!localCamState}
            labelText={`CAMERA ${userCam ? 'ON' : 'OFF'}`}
            aria-label={`카메라 ${userCam ? '켜짐' : '꺼짐'}`}
        >
            {userCam ? (
                <img src={cameraOnImg} alt={'카메라 켜짐'} />
            ) : (
                <img src={cameraOffImg} alt={'카메라 꺼짐'} />
            )}
        </ControlButton>
    );
}

export default CameraButton;
