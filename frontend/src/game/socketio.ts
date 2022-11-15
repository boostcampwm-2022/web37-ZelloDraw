import { io, Socket } from 'socket.io-client';

const socket: Socket = io('ws://localhost:8180', { transports: ['websocket'] });

export const emitStartGameToSocket = () => {
    console.log('socket', socket);
    socket.emit('start-game', { lobbyId: '1234' });
};

export const getRandomWordFromSocket = () => {
    let randomWord = '';
    socket.on('start-game', (payload) => {
        randomWord = payload.randomWord;
        console.log('randomWord', randomWord);
    });

    return randomWord;
};
