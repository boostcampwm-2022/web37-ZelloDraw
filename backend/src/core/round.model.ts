import { IsNotEmpty } from 'class-validator';
import { StartRoundResponse } from './round.dto';

export class Round {
    @IsNotEmpty()
    allUserRounds: StartRoundResponse[];
}
