import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { RedisModule } from './redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './admin/cron.service';

@Module({
    imports: [
        CoreModule,
        RedisModule,
        MongooseModule.forRoot('mongodb://localhost/zellodraw'),
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService, TasksService],
})
export class AppModule {}
