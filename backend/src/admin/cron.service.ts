import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotionService } from './notion.service';

@Injectable()
export class CronService {
    constructor(private readonly notionService: NotionService) {}

    @Cron('* * * * *')
    async actionPerMin() {
        await this.notionService.updateAccumulatedStat();
        await this.notionService.updateCurrentStat();
    }
}
