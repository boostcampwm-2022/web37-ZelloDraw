import { atom } from 'recoil';

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
