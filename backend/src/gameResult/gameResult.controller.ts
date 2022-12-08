import { Controller, Get, Param } from '@nestjs/common';
import { GameResultService } from './gameResult.service';
import { GameResult } from './gameResult.schema';

@Controller('game-result')
export class GameResultController {
    constructor(private readonly gameResultService: GameResultService) {}

    @Get(':id')
    async getById(@Param('id') id: string): Promise<GameResult> {
        return await this.gameResultService.findById(id);
    }
}
