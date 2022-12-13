import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { GameResultService } from '../gameResult/gameResult.service';
import { createAccumulatedStatContext, createCurrentStatContext } from './notion-context-factory';
import { LobbyService } from '../core/lobby.service';
import { UserService } from '../core/user.service';

@Injectable()
export class NotionService {
    notion = new Client({ auth: process.env.NOTION_API_KEY });
    constructor(
        private readonly gameResultService: GameResultService,
        private readonly lobbyService: LobbyService,
        private readonly userService: UserService,
    ) {}

    async updateAccumulatedStat() {
        const stat = await this.gameResultService.getStatBetween(new Date('2000-01-01'));
        await this.notion.blocks.update(
            createAccumulatedStatContext(stat.playedUserCnt, stat.playedGameCnt),
        );
    }

    async updateCurrentStat() {
        const userCnt = (await this.userService.getAllUser()).length;
        const gameCnt = (await this.lobbyService.getAllGameLobby()).length;
        await this.notion.blocks.update(createCurrentStatContext(userCnt, gameCnt));
    }
}
