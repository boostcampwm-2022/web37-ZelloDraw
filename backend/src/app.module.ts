import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [CoreModule, RedisModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
