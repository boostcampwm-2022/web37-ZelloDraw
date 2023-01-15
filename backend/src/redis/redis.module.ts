import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        CacheModule.registerAsync<any>({
            isGlobal: true,
            useFactory: async () => {
                const store = await redisStore({
                    // TODO: 환경변수 분리 필요
                    socket: { host: 'localhost', port: 6379 },
                    ttl: 60 * 60 * 24,
                });
                return {
                    store: () => store,
                };
            },
        }),
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
})
export class RedisModule {}
