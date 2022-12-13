import { useRecoilState, useRecoilValue } from 'recoil';
import { userMicState, userCamState, userStreamRefState, localDeviceState } from '@atoms/user';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import micOffImg from '@assets/buttons/mic-off-btn.svg';
import micOnImg from '@assets/buttons/mic-on-btn.svg';
import ControlButton from '@components/ControlButton';

function MicButton() {
    const selfStreamRef = useRecoilValue(userStreamRefState);
    const [userMic, setUserMic] = useRecoilState(userMicState);
    const userCam = useRecoilValue(userCamState);
    const localMicState = useRecoilValue(localDeviceState).audio;
    const onBtnClick = () => {
        if (!selfStreamRef?.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

        const changed = !userMic;
        setUserMic(changed);
        NetworkService.emit('update-user-stream', { audio: changed, video: userCam });
    };

    return (
        <ControlButton
            onClick={onBtnClick}
            disabled={!localMicState}
            labelText={`MIC ${userMic ? 'ON' : 'OFF'}`}
            aria-label={`마이크 ${userMic ? '켜짐' : '꺼짐'}`}
        >
            {userMic ? (
                <img src={micOnImg} alt={'마이크 켜짐'} />
            ) : (
                <img src={micOffImg} alt={'마이크 꺼짐'} />
            )}
        </ControlButton>
    );
}

export default MicButton;
