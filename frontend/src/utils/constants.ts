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

export const ToolsTypeString = ['PEN', 'PAINT', 'ERASER', 'RESET'];

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
    NotAllowedError: '사이트의 카메라 및 마이크 권한 변경이 필요해요!',
    NotFoundError: '연결된 디바이스가 없어요. 화상 통화를 위해서 마이크와 카메라 연결이 필요해요!',
    NotReadableError: '마이크 카메라가 이미 다른 앱에서 사용되고 있어요!',
    UnknownError: '다시 시도해주세요.',
};

export const MINIMUM_AUDIO_LEVEL = 0.001;
export const VOLUME_DETECT_INTERVAL = 1000;

export const STUN = {
    urls: 'stun:stun.l.google.com:19302',
};

export const TURN = {
    urls: 'turn:zellodraw.com',
    username: 'zello',
    credential: 'password',
};
