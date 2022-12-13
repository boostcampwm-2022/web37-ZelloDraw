import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { GameResultService } from '../gameResult/gameResult.service';

@Injectable()
export class NotionService {
    notion = new Client({ auth: process.env.NOTION_KEY });
    constructor(private readonly gameResultService: GameResultService) {}

    async updateAccumulatedStat() {
        const stat = await this.gameResultService.getStatBetween(new Date('2000-01-01'));
        await this.notion.blocks.update({
            block_id: '1d508a03704e49789f4eb081487ddc11',
            callout: {
                icon: {
                    emoji: '💡',
                },
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: `현재까지 플레이한 누적 인원 수: ${stat.playedUserCnt}명\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `현재까지 진행된 게임 수: ${stat.playedGameCnt}개`,
                        },
                    },
                ],
            },
        });
    }

    async updateCurrentStat(userCnt: number, gameCnt: number) {
        await this.notion.blocks.update({
            block_id: '60f1d7f83b3d4dd9957c3e4b07d1efbd',
            callout: {
                icon: {
                    emoji: '💡',
                },
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: `사용중인 유저 수: ${userCnt}명\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `진행중인 게임 수: ${gameCnt}개`,
                        },
                    },
                ],
            },
        });
    }
}
