import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';
import { GameService } from './game.service';
import { GameLobbyRepository } from './gamelobby.repository';

@Module({
    providers: [CoreGateway, LobbyService, UserService, GameService, GameLobbyRepository],
})
export class CoreModule {}
