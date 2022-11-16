import { atom } from 'recoil';

interface userStateType {
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
