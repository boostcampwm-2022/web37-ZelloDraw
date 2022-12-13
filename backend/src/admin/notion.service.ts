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
}
