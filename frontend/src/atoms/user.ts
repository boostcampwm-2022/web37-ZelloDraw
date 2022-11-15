import { atom } from 'recoil';

interface userStateType {
    name: string;
    isHost: boolean | null;
}

/**
 * 사용자 정보 (name, host 여부)
 */
export const userState = atom<userStateType>({
    key: 'userState',
    default: {
        name: 'test',
        isHost: null,
    },
});
