import { networkServiceInstance as NetworkService } from '@services/socketService';
import { StartRoundEmitRequest, SubmitQuizReplyEmitRequest } from '@backend/core/game.dto';
import { SetterOrUpdater } from 'recoil';

export const emitStartGame = (lobbyId: string) => {
    NetworkService.emit('start-game', lobbyId);
};

export const onStartGame = (
    setPage: (url: string) => void,
    setRoundInfo: SetterOrUpdater<StartRoundEmitRequest>,
) => {
    NetworkService.on('start-game', () => {
        setPage('/game');
    });

    NetworkService.on('start-round', (roundInfo: StartRoundEmitRequest) => {
        setRoundInfo(roundInfo);
    });
};

export const emitSubmitQuizReply = (quizReply: string) => {
    NetworkService.emit('submit-quiz-reply', quizReply);
};
