export const colorName = [
    'brown',
    'green',
    'pink',
    'sky',
    'red',
    'primary',
    'yellow',
    'purple',
    'gray1',
    'black',
    'white',
];

export enum ToolsType {
    PEN,
    PAINT,
    ERASER,
    RESET,
}

export const CANVAS_WIDTH = 742;
export const CANVAS_HEIGHT = 468;
export const PEN_LINE_WIDTH = 5;
export const PEN_DEFAULT_COLOR = '#001D2E';
export const ERASER_COLOR = '#F6F5F8';
export const ERASER_LINE_WIDTH = 20;
export const MAX_WIDTH = 2000;
export const MAX_HEIGHT = 1050;
export const SCALE = Number((window.innerWidth / MAX_WIDTH).toFixed(2));
