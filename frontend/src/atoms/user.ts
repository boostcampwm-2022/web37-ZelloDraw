import { atom } from 'recoil';

export interface userStateType {
    name: string;
    isHost: boolean | null;
}

export interface userMicCamType {
    isMicOn: boolean;
    isCamOn: boolean;
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

/**
 * 사용자 카메라, 마이크 정보
 */

export const userMicCamState = atom<userMicCamType>({
    key: 'userMicCamState',
    default: {
        isMicOn: true,
        isCamOn: false,
    },
});
