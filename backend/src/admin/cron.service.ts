import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotionService } from './notion.service';
import { LobbyService } from 'src/core/lobby.service';
import { GameResultService } from 'src/gameResult/gameResult.service';
import { UserService } from 'src/core/user.service';

@Injectable()
export class CronService {
    constructor(
        private readonly userService: UserService,
        private readonly notionService: NotionService,
        private readonly lobbyService: LobbyService,
        private readonly gameResultService: GameResultService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async actionPerMin() {
        await this.notionService.updateAccumulatedStat();
        await this.notionService.updateCurrentStat();
    }

    @Cron(CronExpression.EVERY_HOUR)
    async actionPerHour() {
        await this.notionService.setHourlyStat();
    }
}
