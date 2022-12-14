import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameResult, GameResultDocument, HourlySnapShotDocument } from './gameResult.schema';
import { GameLobby } from '../core/gameLobby.model';
import { HourlySnapShotRequest, PlayedUserAndGameCnt } from './gameResult.dto';

@Injectable()
export class GameResultService {
    constructor(
        @InjectModel(GameResult.name) private readonly gameResultModel: Model<GameResultDocument>,
        @InjectModel('HourlySnapShot')
        private readonly hourlySnapShotModel: Model<HourlySnapShotDocument>,
    ) {}

    async create(gameLobby: GameLobby): Promise<string> {
        const gameResultDto: GameResult = {
            host: gameLobby.getHost().name,
            user: gameLobby.getUsers().map((user) => user.name),
            maxRound: gameLobby.getMaxRound(),
            quizReplyChains: gameLobby.getQuizReplyChains().map((quizReplyChain) => {
                return {
                    quizReplyList: quizReplyChain.quizReplyList.map((quizReply) => {
                        return {
                            author: quizReply.author.name,
                            content: quizReply.content,
                            type: quizReply.type,
                        };
                    }),
                };
            }),
            gameStartDate: gameLobby.getGameStartDate(),
            gameEndDate: new Date(),
        };
        const gameResult = new this.gameResultModel(gameResultDto);
        return await new Promise((resolve) => {
            gameResult.save((err, res) => {
                resolve(res.id);
            });
        });
    }

    async getStatBetween(startDate: Date, endDate?: Date): Promise<PlayedUserAndGameCnt> {
        const gameResultsBetweenDate = await this.getGameResultBetween(startDate, endDate);
        return gameResultsBetweenDate.reduce(
            (acc, gameResult) => {
                acc.playedGameCnt += 1;
                acc.playedUserCnt += gameResult.user.length;
                return acc;
            },
            { playedUserCnt: 0, playedGameCnt: 0 },
        );
    }

    async getGameResultBetween(
        startDate: Date,
        endDate: Date = new Date('9999-01-01'),
    ): Promise<GameResult[]> {
        const gameResultsBetweenDate = await this.gameResultModel.find({
            gameStartDate: { $gte: startDate, $lte: endDate },
        });
        return gameResultsBetweenDate;
    }

    async setHourlySnapShot(hourlySnapShotDto: HourlySnapShotRequest): Promise<void> {
        const hourlySnapShotModel = new this.hourlySnapShotModel(hourlySnapShotDto);
        await hourlySnapShotModel.save();
    }

    async findById(id: string): Promise<GameResult> {
        return await this.gameResultModel.findById(id).exec();
    }
}
