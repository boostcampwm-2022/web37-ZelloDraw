import { atom, selector } from 'recoil';
import { colors } from '@styles/ZelloTheme';

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
    default: 'black',
});

export const rgbColorSelector = selector<string>({
    key: 'rgbColor',
    get: ({ get }) => {
        const colorName = get(colorState);
        return colors[colorName];
    },
});

interface DrawingToolStateType {
    isPainting: boolean; // 그리기 드로잉 도구 선택 여부
    isFilling: boolean; // 채우기 드로잉 도구 선택 여부
}

export const drawingToolState = atom<DrawingToolStateType>({
    key: `drawingToolState`,
    default: {
        isPainting: false,
        isFilling: false,
    },
});
