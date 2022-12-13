import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/core/user.service';

@Injectable()
export class CronService {
    constructor(private readonly userService: UserService) {}

    @Cron('0 * * * * *')
    async handleUserCountCron() {
        const users = await this.userService.getAllUser();
    }
}
