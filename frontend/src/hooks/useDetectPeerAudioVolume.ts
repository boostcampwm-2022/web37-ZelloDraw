import { RefObject } from 'react';
import { MINIMUM_AUDIO_LEVEL, VOLUME_DETECT_INTERVAL } from '@utils/constants';

function useDetectPeerAudioVolume() {
    const highlightPeerVideo = (pc: RTCPeerConnection, videoRef: RefObject<HTMLVideoElement>) => {
        const interval = setInterval(() => {
            const receiver = pc.getReceivers().find((r: { track: { kind: string } }) => {
                return r.track.kind === 'audio';
            });
            const source = receiver?.getSynchronizationSources()[0];
            if (source?.audioLevel && source?.audioLevel > MINIMUM_AUDIO_LEVEL) {
                videoRef.current?.classList.add('speaking');
            } else {
                videoRef.current?.classList.remove('speaking');
            }
        }, VOLUME_DETECT_INTERVAL);
        return interval;
    };

    return { highlightPeerVideo };
}

export default useDetectPeerAudioVolume;
