import { useEffect, useRef, useCallback } from 'react';
import { MediaErrorType, NOT_SUPPORT_USER_MESSAGE, NOT_SUPPORTED_MESSAGE } from '@utils/constants';
import { userStreamState, userStreamRefState, ConstraintsType } from '@atoms/user';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useSetDeviceState from '@hooks/useSetDeviceState';

function useLocalStream() {
    const setStream = useSetRecoilState(userStreamState);
    const [selfStreamRef, setSelfStreamRef] = useRecoilState(userStreamRefState);
    const streamRef = useRef<MediaStream>();
    const setDeviceInfo = useSetDeviceState();
    const userMicPermission = useRef<boolean>(false);
    const userCamPermission = useRef<boolean>(false);

    const getLocalStream = () => {
        // 현재 연결된 디바이스 정보를 받아와 존재하는 디바이스만 요청을 보냄
        void navigator.mediaDevices.enumerateDevices().then(function (devices) {
            const hasCam = devices.some(function (d) {
                return d.kind === 'videoinput';
            });
            const hasMic = devices.some(function (d) {
                return d.kind === 'audioinput';
            });
            setDeviceInfo({ audio: hasMic, video: hasCam });

            if (!hasCam && !hasMic) alert(MediaErrorType.NotFoundError);
            else void getUserPermission({ video: hasCam, audio: hasMic });
        });
    };

    const getSelfMedia = useCallback((constraints: ConstraintsType) => {
        void navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            streamRef.current = stream;
            setStream(stream);
            setSelfStreamRef(streamRef);
        });
    }, []);

    const getFakeStream = useCallback(() => {
        const fakeStream = new MediaStream();
        streamRef.current = fakeStream;
        setStream(fakeStream);
        setSelfStreamRef(streamRef);
    }, []);

    const getUserPermission = (constraints: ConstraintsType) => {
        // granted - 권한이 '허용'된 경우, 유저에게 미디어 스트림 사용 권한을 요청하고 받아온 스트림 정보를 저장한다.
        // denied or need to be requested - 유저에게 요청하지 않고 fakeStream을 만들어 해당 정보를 저장한다.
        try {
            const camPermissionName = 'camera' as PermissionName;
            const micPermissionName = 'microphone' as PermissionName;
            void navigator.permissions.query({ name: camPermissionName }).then((camPermission) => {
                userCamPermission.current = camPermission.state === 'granted';
            });
            void navigator.permissions.query({ name: micPermissionName }).then((micPermission) => {
                userMicPermission.current = micPermission.state === 'granted';
            });

            if (!userMicPermission.current && !userCamPermission.current) getFakeStream();
            else getSelfMedia(constraints);
        } catch (err: any) {
            // 나머지 예외 상황에 대해 사용자에게 alert창을 띄운다.
            if (err.message.includes(NOT_SUPPORTED_MESSAGE)) {
                alert(NOT_SUPPORT_USER_MESSAGE);
            }
            if (err.name in MediaErrorType) alert(MediaErrorType[err.name]);
            else alert(err.message);
        }
    };

    useEffect(() => {
        if (selfStreamRef) return;
        void getLocalStream();
    }, []);
}

export default useLocalStream;
