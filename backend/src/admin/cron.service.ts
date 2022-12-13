import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/core/user.service';
import { NotionService } from './notion.service';

@Injectable()
export class CronService {
    constructor(
        private readonly userService: UserService,
        private readonly notionService: NotionService,
    ) {}

    @Cron('* * * * *')
    async actionPerMin() {
        await this.notionService.updateAccumulatedStat();
        const users = await this.userService.getAllUser();
    }
}
