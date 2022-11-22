import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';
import { RoundService } from './round.service';
import { GameLobbyRepository } from './gamelobby.repository';

@Module({
    providers: [CoreGateway, LobbyService, UserService, RoundService, GameLobbyRepository],
})
export class CoreModule {}
