import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    @Cron('* * * * * *')
    handleCron() {
        console.log('cron job is running');
    }
}
