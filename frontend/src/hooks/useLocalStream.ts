import { useEffect, useRef, useCallback } from 'react';
import { userCamState, userMicState, userStreamState, userStreamRefState } from '@atoms/user';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

interface localStreamProps {
    videoRef: React.RefObject<HTMLVideoElement> | null;
}

function useLocalStream(): localStreamProps {
    const userCam = useRecoilValue<boolean>(userCamState);
    const userMic = useRecoilValue<boolean>(userMicState);

    const setStream = useSetRecoilState(userStreamState);
    const [selfStreamRef, setSelfStreamRef] = useRecoilState(userStreamRefState);

    const videoRef: React.RefObject<HTMLVideoElement> | null = useRef(null);
    const streamRef = useRef<MediaStream>();

    const getSelfMedia: () => Promise<void> = useCallback(async () => {
        // TODO: 캠과 마이크가 없는 경우 detect 후 처리
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            streamRef.current = stream;
            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;

            setStream(stream);
            setSelfStreamRef(streamRef);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        if (!selfStreamRef?.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    }, [userCam]);

    useEffect(() => {
        if (!selfStreamRef?.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    }, [userMic]);

    useEffect(() => {
        if (selfStreamRef) return;
        void getSelfMedia();
    }, []);

    return { videoRef };
}

export default useLocalStream;
