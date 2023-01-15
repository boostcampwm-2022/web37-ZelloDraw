import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { RedisModule } from './redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { QueueModule } from './bull/queue.module';

@Module({
    imports: [
        CoreModule,
        RedisModule,
        MongooseModule.forRoot('mongodb://localhost/zellodraw'),
        ConfigModule.forRoot(),
        ...(process.env.NODE_APP_INSTANCE === '0' && process.env.NODE_ENV === 'production'
            ? [AdminModule]
            : []),
        ...(process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined
            ? [QueueModule]
            : []),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
