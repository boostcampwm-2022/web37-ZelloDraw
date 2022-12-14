import { atom, selector } from 'recoil';
import { StartRoundEmitRequest } from '@backend/core/game.dto';

/**
 * 로비(게임) id 정보
 */
export const lobbyIdState = atom<string>({
    key: 'lobbyId',
    default: '',
});

/**
 * 로비(게임)에 접속한 유저 리스트
 */

export interface WebRTCUser {
    sid: string; // socketID
    userName: string;
    stream?: MediaStream;
    audio?: boolean;
    video?: boolean;
}

export const userListState = atom<WebRTCUser[]>({
    key: 'userListState',
    default: [],
});

export const streamMapState = atom({
    key: 'streamMapState',
    default: new Map(),
});

export const pcMapState = atom({
    key: 'pcMapState',
    default: new Map(),
});

export const userListLengthState = selector({
    key: 'userListLengthState',
    get: ({ get }) => {
        const userList = get(userListState);
        return userList.length + 1;
    },
});

/**
 * 라운드 정보
 */
export const roundInfoState = atom<StartRoundEmitRequest>({
    key: 'roundInfoState',
    default: undefined,
});

/**
 * true면 현재 그릴 차례, false면 답을 맞출 차례
 */
export const isQuizTypeDrawState = selector({
    key: 'isQuizTypeDrawState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo === undefined) return false;

        return roundInfo.roundType === 'DRAW';
    },
});

export const quizReplyState = selector({
    key: 'quizReplyState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo?.quizReply.content === undefined) {
            return '';
        }

        return roundInfo.quizReply.content;
    },
});

export const roundNumberState = selector({
    key: 'roundNumberState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo === undefined) {
            return { curRound: 0, maxRound: 0 };
        }

        return { curRound: roundInfo.curRound, maxRound: roundInfo.maxRound };
    },
});

export const roundLimitTimeState = selector({
    key: 'roundLimitTimeState',
    get: ({ get }) => {
        const roundInfo = get(roundInfoState);

        if (roundInfo === undefined) {
            return 60;
        }

        return roundInfo.limitTime;
    },
});

export const quizSubmitState = atom<boolean>({
    key: 'quizSubmitState',
    default: false,
});

export const userReplyState = atom<string>({
    key: 'userReplyState',
    default: '',
});

export const submittedQuizReplyCountState = atom<number>({
    key: 'submittedQuizReplyCountState',
    default: 0,
});

export const canClearCanvasState = atom<boolean>({
    key: 'canClearCanvasState',
    default: false,
});

export const resetModalOpenState = atom<boolean>({
    key: 'resetModalState',
    default: false,
});

export const isRoundTimeoutState = atom<boolean>({
    key: 'isRoundTimeoutState',
    default: false,
});
