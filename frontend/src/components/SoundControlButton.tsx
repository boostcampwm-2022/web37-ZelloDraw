import { isSoundOnState } from '@atoms/user';
import { useRecoilState } from 'recoil';
import SoundOffIcon from '@assets/buttons/sound-off-btn.svg';
import SoundOnIcon from '@assets/buttons/sound-on-btn.svg';
import ControlButton from '@components/ControlButton';

function SoundControlButton() {
    const [isSoundOn, setIsSoundOn] = useRecoilState(isSoundOnState);

    return (
        <ControlButton
            onClick={() => setIsSoundOn((prev) => !prev)}
            labelText={`SOUND ${isSoundOn ? 'ON' : 'OFF'}`}
        >
            {isSoundOn ? (
                <img src={SoundOnIcon} alt='효과음이 켜져있어요. 끄고싶다면 눌러주세요.' />
            ) : (
                <img src={SoundOffIcon} alt='효과음이 꺼져있어요. 켜고싶다면 눌러주세요.' />
            )}
        </ControlButton>
    );
}

export default SoundControlButton;
