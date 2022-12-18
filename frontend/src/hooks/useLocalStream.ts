import { useEffect, useRef, useCallback } from 'react';
// import { MediaErrorType, NOT_SUPPORT_USER_MESSAGE, NOT_SUPPORTED_MESSAGE } from '@utils/constants';
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

    const userMicPermission = useRef<boolean>(false);
    const userCamPermission = useRef<boolean>(false);

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
            setCamDeviceInfo(hasCam);
            setMicDeviceInfo(hasMic);
            getFakeStream();
        } else void getUserPermission({ video: hasCam, audio: hasMic });
    };

    const getCamPermissionStatus = async () => {
        const camPermissionName = 'camera' as PermissionName;
        const camPermission = await navigator.permissions.query({ name: camPermissionName });
        const isCamGranted = camPermission && camPermission.state === 'granted'; // Access has been granted
        setCamDeviceInfo(isCamGranted);
        userCamPermission.current = isCamGranted;
        camPermission.onchange = (e: any) => {
            if (e.target.state === 'granted') location.reload();
        };
    };

    const getMicPermissionStatus = async () => {
        const micPermissionName = 'microphone' as PermissionName;
        const micPermission = await navigator.permissions.query({ name: micPermissionName });
        const isMicGranted = micPermission && micPermission.state === 'granted'; // Access has been granted
        setMicDeviceInfo(isMicGranted);
        userMicPermission.current = isMicGranted;
        micPermission.onchange = (e: any) => {
            if (e.target.state === 'granted') location.reload();
        };
    };

    const getUserPermission = (constraints: ConstraintsType) => {
        // 브라우저에서 설정된 마이크, 카메라 권한 정보를 받아온다.
        constraints.video && getCamPermissionStatus();
        constraints.audio && getMicPermissionStatus();

        // 유저에게 미디어 스트림 사용 권한을 요청하고 받아온 스트림 정보를 저장한다.
        void getSelfMedia({ video: constraints.video, audio: constraints.audio });
    };

    const getSelfMedia = useCallback(async (constraints: ConstraintsType) => {
        try {
            if (constraints.audio) {
                constraints.audio = { noiseSuppression: true, echoCancellation: true };
            }
            // 유저 MediaStream을 받아온다.
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            setStream(stream);
            setSelfStreamRef(streamRef);
        } catch (err: any) {
            // 나머지 예외 상황에 대해 사용자에게 alert창을 띄운다.
            // catch error는 permission이 하나 이상 denied 상태일 때도 실행된다.
            // if (err.message.includes(NOT_SUPPORTED_MESSAGE)) {
            //     alert(NOT_SUPPORT_USER_MESSAGE);
            // }
            // if (err.name in MediaErrorType) alert(MediaErrorType[err.name]);

            if (userCamPermission.current || userMicPermission.current) {
                void getSelfMedia({
                    video: userCamPermission.current,
                    audio: userMicPermission.current,
                });
            } else {
                getFakeStream();
            }
        }
    }, []);

    const getFakeStream = () => {
        const fakeStream = new MediaStream();
        streamRef.current = fakeStream;
        setStream(fakeStream);
        setSelfStreamRef(streamRef);
    };

    useEffect(() => {
        if (selfStreamRef) return;
        void getLocalStream();
    }, []);
}

export default useLocalStream;
