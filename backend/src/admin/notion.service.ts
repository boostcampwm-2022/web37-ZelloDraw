import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { GameResultService } from '../gameResult/gameResult.service';
import { createAccumulatedStatContext, createCurrentStatContext } from './notion-context-factory';

@Injectable()
export class NotionService {
    notion = new Client({ auth: process.env.NOTION_KEY });
    constructor(private readonly gameResultService: GameResultService) {}

    async updateAccumulatedStat() {
        const stat = await this.gameResultService.getStatBetween(new Date('2000-01-01'));
        await this.notion.blocks.update(
            createAccumulatedStatContext(stat.playedUserCnt, stat.playedGameCnt),
        );
    }

    async updateCurrentStat(userCnt: number, gameCnt: number) {
        await this.notion.blocks.update(createCurrentStatContext(userCnt, gameCnt));
    }
}
