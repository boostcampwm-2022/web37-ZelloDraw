import { useEffect, useRef, useCallback } from 'react';
import { MediaErrorType, NOT_SUPPORT_USER_MESSAGE, NOT_SUPPORTED_MESSAGE } from '@utils/constants';
import {
    userStreamState,
    userStreamRefState,
    ConstraintsType,
    userCamState,
    userMicState,
    localDeviceState,
} from '@atoms/user';
import { useSetRecoilState, useRecoilState } from 'recoil';

function useLocalStream() {
    const setStream = useSetRecoilState(userStreamState);
    const [selfStreamRef, setSelfStreamRef] = useRecoilState(userStreamRefState);
    const streamRef = useRef<MediaStream>();

    const setUserCam = useSetRecoilState<boolean>(userCamState);
    const setUserMic = useSetRecoilState<boolean>(userMicState);
    const setLocalDevices = useSetRecoilState(localDeviceState);

    const setMicDeviceInfo = (audio: boolean) => {
        setLocalDevices((prev) => ({ ...prev, audio }));
        setUserMic(audio);
    };

    const setCamDeviceInfo = (video: boolean) => {
        setLocalDevices((prev) => ({ ...prev, video }));
        setUserCam(video);
    };

    const getLocalStream = async () => {
        // 현재 연결된 마이크, 카메라 디바이스가 있는지 여부를 확인한다.
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCam = devices.some(function (d) {
            return d.kind === 'videoinput';
        });
        const hasMic = devices.some(function (d) {
            return d.kind === 'audioinput';
        });

        if (!hasCam && !hasMic) {
            // alert(MediaErrorType.NotFoundError);
            setCamDeviceInfo(hasCam);
            setMicDeviceInfo(hasMic);
            getFakeStream();
        } else void getUserPermission({ video: hasCam, audio: hasMic });
    };

    const getUserPermission = async (constraints: ConstraintsType) => {
        // 브라우저에서 설정된 마이크, 카메라 권한 정보를 받아온다.
        const camPermissionName = 'camera' as PermissionName;
        const micPermissionName = 'microphone' as PermissionName;

        const camPermission = await navigator.permissions.query({ name: camPermissionName });
        const isCamGranted = constraints.video && camPermission.state === 'granted'; // Access has been granted
        const userCamPermission = isCamGranted;
        setCamDeviceInfo(isCamGranted);

        const micPermission = await navigator.permissions.query({ name: micPermissionName });
        const isMicGranted = constraints.audio && micPermission.state === 'granted'; // Access has been granted
        const userMicPermission = isMicGranted;
        setMicDeviceInfo(isMicGranted);

        // if - 유저에게 미디어 스트림 사용 권한을 요청하지 않고 fakeStream을 만들어 해당 정보를 저장한다.
        // else - 유저에게 미디어 스트림 사용 권한을 요청하고 받아온 스트림 정보를 저장한다.
        if (!userMicPermission && !userCamPermission) getFakeStream();
        else void getSelfMedia({ video: isCamGranted, audio: isMicGranted });
    };

    const getSelfMedia = useCallback(async (constraints: ConstraintsType) => {
        try {
            // 유저 MediaStream을 받아온다.
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            setStream(stream);
            setSelfStreamRef(streamRef);
        } catch (err: any) {
            // 나머지 예외 상황에 대해 사용자에게 alert창을 띄운다.
            if (err.message.includes(NOT_SUPPORTED_MESSAGE)) {
                alert(NOT_SUPPORT_USER_MESSAGE);
            }
            if (err.name in MediaErrorType) alert(MediaErrorType[err.name]);
            else alert(err.message);
        }
    }, []);

    const getFakeStream = useCallback(() => {
        const fakeStream = new MediaStream();
        streamRef.current = fakeStream;
        setStream(fakeStream);
        setSelfStreamRef(streamRef);
    }, []);

    useEffect(() => {
        if (selfStreamRef) return;
        void getLocalStream();
    }, []);
}

export default useLocalStream;
