// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-scripts" />

declare module '*.mp3';
declare module '*.wav';

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_SOCKET_PATH: string;
        REACT_APP_SOCKET_URL: string;
    }
}
