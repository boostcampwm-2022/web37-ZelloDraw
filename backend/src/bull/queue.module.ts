import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CoreProcessor } from './queue.processor';
import { CoreModule } from '../core/core.module';

@Module({
    imports: [
        CoreModule,
        BullModule.registerQueue({
            name: 'core',
        }),
    ],
    providers: [CoreProcessor],
})
export class QueueModule {}
