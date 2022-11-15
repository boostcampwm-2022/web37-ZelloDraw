import { io, Socket } from 'socket.io-client';

const socket: Socket = io('ws://localhost:8180/core', { transports: ['websocket'] });

export const emitStartGameToSocket = () => {
    console.log('socket', socket);
    socket.emit('start-game', { lobbyId: '1234' });
};

export const getRandomWordFromSocket = async () => {
    const randomWord = await new Promise<string>((resolve) => {
        socket.on('start-game', (payload: { randomWord: string }) => {
            resolve(payload.randomWord);
        });
    });

    return randomWord;
};
