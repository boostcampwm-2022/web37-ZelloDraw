import { io, Socket } from 'socket.io-client';

export class SocketService {
    private static instance: SocketService;
    private readonly socket: Socket;
    public socketId = '';

    private constructor() {
        this.socket = io('ws://localhost:8180/core', {
            transports: ['websocket'],
        });
        this.socket.connect();
        // TODO: 타이밍 이슈 여부 파악 및 해결
        this.socket.on('connect', () => {
            this.socketId = this.socket.id;
        });
    }

    public static getInstance() {
        if (this.instance === undefined) {
            this.instance = new SocketService();
        }
        return this.instance;
    }

    public on(event: string, callback: (...args: any[]) => void) {
        this.socket.on(event, callback);
    }

    public off(event: string) {
        this.socket.off(event);
    }

    public emit(event: string, ...args: any[]) {
        this.socket.emit(event, ...args);
    }
}

export const networkServiceInstance = SocketService.getInstance();
