import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameResult, GameResultDocument } from './gameResult.schema';

@Injectable()
export class GameResultService {
    constructor(
        @InjectModel(GameResult.name) private readonly gameResultModel: Model<GameResultDocument>,
    ) {}

    async create(gameResultDto: GameResult) {
        const gameResult = new this.gameResultModel(gameResultDto);
        await gameResult.save();
    }
}
