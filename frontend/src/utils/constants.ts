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

export const CANVAS_WIDTH = 750;
export const CANVAS_HEIGHT = 472;
export const PEN_DEFAULT_LINE_WIDTH = 5;
export const PEN_DEFAULT_COLOR = '#001D2E';
export const ERASER_COLOR = '#F6F5F8';
export const ERASER_DEFAULT_LINE_WIDTH = 20;
export const MAX_WIDTH = 2000;
export const MAX_HEIGHT = 1050;
export const SCALE = Number((window.innerWidth / MAX_WIDTH).toFixed(2));
export const GUIDE_PAGE_IDX = -1;

export const canvasLineWidthValues = [2.5, 5, 15, 30];

export enum CanvasState {
    DRAW,
    PAINT,
    NONE,
}

export const RTCOfferOptions = { offerToReceiveAudio: true, offerToReceiveVideo: true };

export const NOT_SUPPORTED_MESSAGE =
    'mediaDevices API or getUserMedia method is not supported in this browser.';

export const NOT_SUPPORT_USER_MESSAGE = 'To record audio, use browsers like Chrome and Firefox.';

interface MediaError {
    [key: string]: string;
}

export const MediaErrorType: MediaError = {
    AbortError: 'An AbortError has occured.',
    NotAllowedError: 'A NotAllowedError has occured. User might have denied permission.',
    NotFoundError: 'A NotFoundError has occured.',
    NotReadableError: 'A NotReadableError has occured.',
    SecurityError: 'A SecurityError has occured.',
    TypeError: 'A TypeError has occured.',
    InvalidStateError: 'An InvalidStateError has occured.',
    UnknownError: 'An UnknownError has occured.',
};
