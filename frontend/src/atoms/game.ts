import { atom } from 'recoil';

/**
 * 로비(게임)에 접속한 유저 리스트
 */
export const userListState = atom<string[]>({
    key: 'userListState',
    default: [],
});

/**
 * 유저의 드로잉 정보 (선택한 색상, 그리기 도구)
 */
export const colorState = atom<string>({
    key: 'colorState',
    default: '#001D2E',
});
