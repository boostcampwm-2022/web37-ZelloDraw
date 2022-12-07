import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameResult, GameResultSchema } from './gameResult.schema';
import { GameResultService } from './gameResult.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: GameResult.name, schema: GameResultSchema }])],
    controllers: [],
    providers: [GameResultService],
})
export class GameResultModule {}
