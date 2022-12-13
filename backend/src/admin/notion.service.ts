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

    async updateHourlyStat(userCnt: number, gameCnt: number) {
        await this.notion.pages.create({
            parent: { database_id: '789ac60c6f814d3dbef705f9ea310297' },
            properties: {
                '접속자 수(최대)': {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: userCnt.toString(),
                            },
                        },
                    ],
                },
                '게임 진행 수': {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: gameCnt.toString(),
                            },
                        },
                    ],
                },
                일시: {
                    type: 'date',
                    date: {
                        start: new Date().toISOString(),
                    },
                },
            },
        });
    }
}
