import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameResult, GameResultDocument } from './gameResult.schema';
import { GameLobby } from '../core/gameLobby.model';

@Injectable()
export class GameResultService {
    constructor(
        @InjectModel(GameResult.name) private readonly gameResultModel: Model<GameResultDocument>,
    ) {}

    async create(gameLobby: GameLobby) {
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
        };
        const gameResult = new this.gameResultModel(gameResultDto);
        await gameResult.save();
    }
}
