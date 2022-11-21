import { networkServiceInstance as NetworkService } from '@services/socketService';
import { roundInfoType } from '@atoms/game';
import { SetterOrUpdater } from 'recoil';

export const emitStartGame = (lobbyId: string) => {
    NetworkService.emit('start-game', lobbyId);
};

export const onStartGame = (
    setPage: (url: string) => void,
    setRoundInfo: SetterOrUpdater<roundInfoType>,
) => {
    NetworkService.on('start-game', (payload: any) => {
        emitStartRound(payload.lobbyId);
        getRoundInfo(setRoundInfo);
        setPage('/game');
    });
};

export const emitStartRound = (lobbyId: string) => {
    NetworkService.emit('start-round', lobbyId);
};

export const getRoundInfo = (setRoundInfo: SetterOrUpdater<roundInfoType>) => {
    NetworkService.on('start-round', (userRound: roundInfoType) => {
        setRoundInfo(userRound);
    });
};
