import { useRecoilValue } from 'recoil';
import { isSoundOnState } from '@atoms/user';

function useSoundEffect() {
    const isSoundOn = useRecoilValue(isSoundOnState);
    const audio = new Audio();

    function playSoundEffect(src: string) {
        if (!isSoundOn) return;

        audio.src = src;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then((_) => {
                    /* Autoplay started! */
                })
                .catch((_) => {
                    // Auto-play was prevented
                });
        }
    }

    return { playSoundEffect };
}

export default useSoundEffect;
