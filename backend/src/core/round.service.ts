import { Injectable } from '@nestjs/common';
import { Round } from './round.model';
import { StartRoundRequest } from './round.dto';

@Injectable()
export class RoundService {
    startRound(body: StartRoundRequest): Round {
        // TODO: 해당 로비의 round 정보를 파악하여, 다음 라운드를 지정.
        return {
            type: 'DRAW',
            round: 1,
            lobbyId: body.lobbyId,
            limitTime: 60,
        };
    }
}
