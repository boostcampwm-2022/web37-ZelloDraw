import { Injectable } from '@nestjs/common';
import { Round } from './round.model';
import { Lobby } from './lobby.service';

@Injectable()
export class RoundService {
    startRound(lobby: Lobby): Round {
        // round가 짝수이면 단어를 확인하는 시간 ex) 0번째, 2번째 라운드
        // round가 홀수이면 그림을 그리는 시간 ex) 1번째, 3번째 라운드
        const roundTime = lobby.rounds.length;
        return {
            type: roundTime % 2 === 0 ? 'ANSWER' : 'DRAW',
            round: roundTime,
            lobbyId: lobby.id,
            limitTime: roundTime % 2 === 0 ? 30 : 60,
        };
    }
}
