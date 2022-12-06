import { useEffect, useRef, useCallback } from 'react';
import { userCamState, userMicState, userStreamState, userStreamRefState } from '@atoms/user';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

interface ConstraintsType {
    video: boolean;
    audio: boolean;
}

function useLocalStream() {
    const userCam = useRecoilValue<boolean>(userCamState);
    const userMic = useRecoilValue<boolean>(userMicState);

    const setStream = useSetRecoilState(userStreamState);
    const [selfStreamRef, setSelfStreamRef] = useRecoilState(userStreamRefState);
    const streamRef = useRef<MediaStream>();

    const getLocalStream = () => {
        void navigator.mediaDevices.enumerateDevices().then(function (devices) {
            const hasCam = devices.some(function (d) {
                return d.kind === 'videoinput';
            });
            const hasMic = devices.some(function (d) {
                return d.kind === 'audioinput';
            });
            void getSelfMedia({ video: hasCam, audio: hasMic });
        });
    };

    const getSelfMedia = useCallback(async (constraints: ConstraintsType) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

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
        void getLocalStream();
    }, []);
}

export default useLocalStream;
