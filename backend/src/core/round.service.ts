import { Injectable } from '@nestjs/common';
import { StartRoundResponse } from './round.dto';
import { Lobby } from './lobby.service';

@Injectable()
export class RoundService {
    startRound(lobby: Lobby): StartRoundResponse {
        // round가 짝수이면 단어를 확인하는 시간 ex) 0번째, 2번째 라운드
        // round가 홀수이면 그림을 그리는 시간 ex) 1번째, 3번째 라운드
        const roundTime = lobby.rounds.length;
        return {
            type: roundTime % 2 === 0 ? 'ANSWER' : 'DRAW',
            round: roundTime,
            lobbyId: lobby.id,
            limitTime: roundTime % 2 === 0 ? 30 : 60,
            word: this.getRandomWord(),
        };
    }

    getRandomWord(): string {
        return this.getRandomInt(100);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max).toString();
    }
}
