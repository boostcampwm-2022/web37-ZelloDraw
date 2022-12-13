import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotionService } from './notion.service';
import { LobbyService } from 'src/core/lobby.service';
import { GameResultService } from 'src/gameResult/gameResult.service';
import { HourlySnapShotRequest } from 'src/gameResult/gameResult.dto';

@Injectable()
export class CronService {
    constructor(
        private readonly userService: UserService,
        private readonly notionService: NotionService,
        private readonly lobbyService: LobbyService,
        private readonly gameResultService: GameResultService,
    ) {}

    hourlyMaxUserCnt = 0;
    hourlyMaxGameCnt = 0;

    @Cron(CronExpression.EVERY_MINUTE)
    async actionPerMin() {
        await this.notionService.updateAccumulatedStat();
        await this.updateCurrentStat();
    }

    @Cron('0 * * * *')
    async actionPerHour() {
        await this.setHourlyMaxCnt(this.hourlyMaxUserCnt, this.hourlyMaxGameCnt);
    }

    async updateCurrentStat() {
        const users = await this.userService.getAllUser();
        const gameLobbies = await this.lobbyService.getAllGameLobby();
        await this.notionService.updateCurrentStat(users.length, gameLobbies.length);
        this.updateHourlyMaxCnt(users.length, gameLobbies.length);
    }

    async setHourlyMaxCnt(userCnt: number, gameCnt: number) {
        await this.notionService.updateHourlyStat(this.hourlyMaxUserCnt, this.hourlyMaxGameCnt);
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
