import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { RedisModule } from './redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        CoreModule,
        RedisModule,
        MongooseModule.forRoot('mongodb://localhost/zellodraw'),
        ConfigModule.forRoot(),
        ...(process.env.NODE_APP_INSTANCE === '0'
            ? [ScheduleModule.forRoot()]
            : process.env.NODE_ENV === 'development'
            ? [ScheduleModule.forRoot()]
            : []),
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
