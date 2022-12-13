import micOffImg from '@assets/buttons/mic-off-btn.svg';
import micOnImg from '@assets/buttons/mic-on-btn.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userMicState, userCamState, userStreamRefState, localDeviceState } from '@atoms/user';
import { networkServiceInstance as NetworkService } from '../services/socketService';
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
        >
            {userMic ? (
                <img src={micOnImg} alt={'마이크가 켜져있어요. 끄고싶다면 눌러주세요.'} />
            ) : (
                <img src={micOffImg} alt={'마이크가 꺼져있어요. 켜고싶다면 눌러주세요.'} />
            )}
        </ControlButton>
    );
}

export default MicButton;
