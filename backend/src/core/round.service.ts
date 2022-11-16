import { Injectable } from '@nestjs/common';
import { Round } from './round.model';
import { StartRoundRequest } from './round.dto';

@Injectable()
export class RoundService {
    startRound(body: StartRoundRequest): Round {
        return {
            round: body.round,
            lobbyId: body.lobbyId,
            startTime: new Date(),
            completeTime: new Date(),
        };
    }
}
