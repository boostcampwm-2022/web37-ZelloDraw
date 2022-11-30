/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useRef, useCallback } from 'react';
import { userCamState, userMicState } from '@atoms/user';
import { useRecoilValue } from 'recoil';

interface localStreamProps {
    selfStreamRef: React.MutableRefObject<MediaStream | undefined>;
    selfVideoRef: React.RefObject<HTMLVideoElement>;
    getSelfMedia: () => Promise<void>;
}

function useLocalStream(): localStreamProps {
    const userCam = useRecoilValue<boolean>(userCamState);
    const userMic = useRecoilValue<boolean>(userMicState);

    const selfVideoRef = useRef<HTMLVideoElement>(null);
    const selfStreamRef = useRef<MediaStream | undefined>();

    const getSelfMedia: () => Promise<void> = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: userCam,
                audio: userMic,
            });
            selfStreamRef.current = stream;

            if (!selfVideoRef.current) return;
            selfVideoRef.current.srcObject = stream;
            console.log('getSelfMedia');
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    }, [userCam]);

    useEffect(() => {
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    }, [userMic]);

    return { selfStreamRef, selfVideoRef, getSelfMedia };
}

export default useLocalStream;
