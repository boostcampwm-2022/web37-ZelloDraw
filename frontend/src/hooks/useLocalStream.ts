import { MediaErrorType, NOT_SUPPORT_USER_MESSAGE } from './../utils/constants';
import { useEffect, useRef, useCallback } from 'react';
import {
    userCamState,
    userMicState,
    userStreamState,
    userStreamRefState,
    ConstraintsType,
    localDeviceState,
} from '@atoms/user';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NOT_SUPPORTED_MESSAGE } from '@utils/constants';

function useLocalStream() {
    const setUserCam = useSetRecoilState<boolean>(userCamState);
    const setUserMic = useSetRecoilState<boolean>(userMicState);
    const setLocalDevices = useSetRecoilState(localDeviceState);

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
            setLocalDevices({ audio: hasMic, video: hasCam });
            setUserCam(hasCam);
            setUserMic(hasMic);
            // if (!hasCam && !hasMic) alert(MediaErrorType.NotFoundError);
            // else
            void getSelfMedia({ video: hasCam, audio: hasMic });
        });
    };

    const getSelfMedia = useCallback(async (constraints: ConstraintsType) => {
        try {
            const permissionName = 'camera' as PermissionName;
            void navigator.permissions.query({ name: permissionName }).then((permission) => {
                if (permission.state === 'granted') {
                    // OK - Access has been granted to the microphone
                    void navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                        streamRef.current = stream;

                        setStream(stream);
                        setSelfStreamRef(streamRef);
                    });
                } else if (permission.state === 'denied') {
                    // KO - Access has been denied. Microphone can't be used
                } else {
                    // Permission should be asked
                    const fakeStream = new MediaStream();

                    streamRef.current = fakeStream;
                    setStream(fakeStream);
                    setSelfStreamRef(streamRef);
                }
            });
        } catch (err: any) {
            if (err.message.includes(NOT_SUPPORTED_MESSAGE)) {
                alert(NOT_SUPPORT_USER_MESSAGE);
            }
            if (err.name in MediaErrorType) alert(MediaErrorType[err.name]);
            else alert(err.message);
        }
    }, []);

    useEffect(() => {
        if (selfStreamRef) return;
        void getLocalStream();
    }, []);
}

export default useLocalStream;
