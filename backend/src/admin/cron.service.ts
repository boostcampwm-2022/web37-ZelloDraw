import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/core/user.service';
import { NotionService } from './notion.service';
import { LobbyService } from 'src/core/lobby.service';

@Injectable()
export class CronService {
    constructor(
        private readonly userService: UserService,
        private readonly notionService: NotionService,
        private readonly lobbyService: LobbyService,
    ) {}

    @Cron('* * * * *')
    async actionPerMin() {
        await this.notionService.updateAccumulatedStat();
        const users = await this.userService.getAllUser();
        const gameLobbies = await this.lobbyService.getAllGameLobby();
    }
}
