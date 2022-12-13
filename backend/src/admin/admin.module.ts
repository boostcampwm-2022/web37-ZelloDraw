import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CoreModule } from 'src/core/core.module';

@Module({
    imports: [CoreModule],
    providers: [CronService],
})
export class AdminModule {}
