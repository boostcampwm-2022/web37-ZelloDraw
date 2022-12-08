import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';
import { GameService } from './game.service';
import { GameLobbyRepository } from './gamelobby.repository';
import { GameResultModule } from '../gameResult/gameResult.module';

@Module({
    imports: [GameResultModule],
    providers: [CoreGateway, LobbyService, UserService, GameService, GameLobbyRepository],
})
export class CoreModule {}
