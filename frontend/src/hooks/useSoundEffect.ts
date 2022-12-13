import { useRecoilValue } from 'recoil';
import { isSoundOnState } from '@atoms/user';

function useSoundEffect() {
    const isSoundOn = useRecoilValue(isSoundOnState);
    const audio = new Audio();

    function playSoundEffect(src: string) {
        if (!isSoundOn) return;

        audio.src = src;
        void audio.play();
    }

    return { playSoundEffect };
}

export default useSoundEffect;
