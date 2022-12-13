import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { GameResultService } from '../gameResult/gameResult.service';
import { createAccumulatedStatContext, createCurrentStatContext } from './notion-context-factory';
import { LobbyService } from '../core/lobby.service';
import { UserService } from '../core/user.service';
import { HourlySnapShotRequest } from 'src/gameResult/gameResult.dto';

@Injectable()
export class NotionService {
    notion = new Client({ auth: process.env.NOTION_API_KEY });
    constructor(
        private readonly gameResultService: GameResultService,
        private readonly lobbyService: LobbyService,
        private readonly userService: UserService,
    ) {}

    hourlyMaxUserCnt = 0;
    hourlyMaxGameCnt = 0;

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
        this.updateHourlyMaxCnt(userCnt, gameCnt);
    }

    async setHourlyStat() {
        await this.notion.pages.create({
            parent: { database_id: '789ac60c6f814d3dbef705f9ea310297' },
            properties: {
                '접속자 수(최대)': {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: this.hourlyMaxUserCnt.toString(),
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
                                content: this.hourlyMaxGameCnt.toString(),
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

        const newHourlySnapshot = new HourlySnapShotRequest(
            this.hourlyMaxUserCnt,
            this.hourlyMaxGameCnt,
            new Date(),
        );
        await this.gameResultService.setHourlySnapShot(newHourlySnapshot);
        this.hourlyMaxUserCnt = 0;
        this.hourlyMaxGameCnt = 0;
    }

    updateHourlyMaxCnt(userCnt: number, gameCnt: number) {
        if (this.hourlyMaxUserCnt < userCnt) {
            this.hourlyMaxUserCnt = userCnt;
        }
        if (this.hourlyMaxGameCnt < gameCnt) {
            this.hourlyMaxGameCnt = gameCnt;
        }
    }
}
