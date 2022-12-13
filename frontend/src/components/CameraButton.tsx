import cameraOffImg from '@assets/buttons/camera-off-btn.svg';
import cameraOnImg from '@assets/buttons/camera-on-btn.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userCamState, userStreamRefState, localDeviceState } from '@atoms/user';
import ControlButton from '@components/ControlButton';
import useUserSocket from '@hooks/socket/useUserSocket';

function CameraButton() {
    const selfStreamRef = useRecoilValue(userStreamRefState);
    const [userCam, setUserCam] = useRecoilState(userCamState);
    const localCamState = useRecoilValue(localDeviceState).video;
    const { emitUpdateUserStream } = useUserSocket();
    const onBtnClick = () => {
        if (!selfStreamRef?.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));

        const changed = !userCam;
        setUserCam(changed);
        emitUpdateUserStream();
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
