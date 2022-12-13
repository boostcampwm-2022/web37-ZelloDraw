import { atom } from 'recoil';

export interface userStateType {
    name: string;
    isHost: boolean | null;
}

const getRandUserName = (): string => {
    const curTime = new Date().getTime().toString();
    return `유저${curTime.substring(curTime.length - 5, curTime.length)}`;
};

/**
 * 사용자 정보 (name, host 여부)
 */
export const userState = atom<userStateType>({
    key: 'userState',
    default: {
        name: getRandUserName(),
        isHost: null,
    },
});

export interface ConstraintsType {
    video: boolean;
    audio: any;
}

export const localDeviceState = atom<ConstraintsType>({
    key: 'localDeviceState',
    default: {
        video: false,
        audio: false,
    },
});

/**
 * 사용자 카메라, 마이크 정보
 */

export const userMicState = atom<boolean>({
    key: 'userMicState',
    default: undefined,
});

export const userCamState = atom<boolean>({
    key: 'userCamState',
    default: undefined,
});

/**
 * 사용자 비디오 스트림 정보
 */

export const userStreamState = atom<MediaStream>({
    key: 'userStreamState',
    default: new MediaStream(),
});

export const userStreamRefState = atom<React.MutableRefObject<MediaStream | undefined>>({
    key: 'userStreamRefState',
    default: undefined,
});

/**
 * 효과음 컨트롤
 */
export const isSoundOnState = atom<boolean>({
    key: 'soundEffectState',
    default: true,
});
