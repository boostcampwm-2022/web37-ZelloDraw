import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { RedisModule } from './redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GameResultModule } from './gameResult/gameResult.module';

@Module({
    imports: [
        CoreModule,
        RedisModule,
        MongooseModule.forRoot('mongodb://localhost/zellodraw'),
        GameResultModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
