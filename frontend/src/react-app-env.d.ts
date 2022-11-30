// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PUBLIC_URL: string;
        REACT_APP_TEST: string;
        SOCKET_PATH: string;
    }
}
