import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    GameResult,
    GameResultSchema,
    HourlySnapShot,
    HourlySnapShotSchema,
} from './gameResult.schema';
import { GameResultService } from './gameResult.service';
import { GameResultController } from './gameResult.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: GameResult.name, schema: GameResultSchema },
            { name: HourlySnapShot.name, schema: HourlySnapShotSchema },
        ]),
    ],
    exports: [
        GameResultService,
        MongooseModule.forFeature([{ name: GameResult.name, schema: GameResultSchema }]),
    ],
    controllers: [GameResultController],
    providers: [GameResultService],
})
export class GameResultModule {}
