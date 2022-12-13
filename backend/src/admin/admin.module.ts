import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CoreModule } from 'src/core/core.module';
import { NotionService } from './notion.service';
import { GameResultModule } from '../gameResult/gameResult.module';

@Module({
    imports: [CoreModule, GameResultModule],
    providers: [CronService, NotionService],
})
export class AdminModule {}
