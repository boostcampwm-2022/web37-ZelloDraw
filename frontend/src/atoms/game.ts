import { atom, selector } from 'recoil';

export interface roundInfoType {
    type: 'DRAW' | 'ANSWER';
    round: number;
    lobbyId: string;
    limitTime: number;
    word?: string;
    image?: any;
}

/**
 * 로비(게임)에 접속한 유저 리스트
 */
export const userListState = atom<string[]>({
    key: 'userListState',
    default: [],
});

/**
 * 라운드 정보
 */
export const roundInfoState = atom<roundInfoType>({
    key: 'roundInfoState',
    default: undefined,
});

/**
 * true면 현재 그릴 차례, false면 답을 맞출 차례
 */
export const roundDrawState = selector({
    key: 'roundDrawState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo === undefined) return false;

        return roundInfo.type === 'DRAW';
    },
});

export const roundWordState = selector({
    key: 'roundWordState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo === undefined || roundInfo.word === undefined) {
            return '';
        }

        return roundInfo.word;
    },
});

export const roundNumberState = selector({
    key: 'roundNumberState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo === undefined) {
            return 0;
        }

        return roundInfo.round;
    },
});

export const submitState = atom<boolean>({
    key: 'submitState',
    default: false,
});
