import { useRecoilState, useRecoilValue } from 'recoil';
import { userMicState, userStreamRefState, localDeviceState } from '@atoms/user';
import micOffImg from '@assets/buttons/mic-off-btn.svg';
import micOnImg from '@assets/buttons/mic-on-btn.svg';
import ControlButton from '@components/ControlButton';
import useUserSocket from '@hooks/socket/useUserSocket';

function MicButton() {
    const selfStreamRef = useRecoilValue(userStreamRefState);
    const [userMic, setUserMic] = useRecoilState(userMicState);
    const localMicState = useRecoilValue(localDeviceState).audio;
    const { emitUpdateUserStream } = useUserSocket();
    const onBtnClick = () => {
        if (!localMicState || !selfStreamRef?.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

        const changed = !userMic;
        setUserMic(changed);
        emitUpdateUserStream({ audio: changed });
    };

    return (
        <ControlButton
            onClick={onBtnClick}
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
