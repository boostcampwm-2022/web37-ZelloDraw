// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_SOCKET_PATH: string;
        REACT_APP_SOCKET_URL: string;
    }
}
