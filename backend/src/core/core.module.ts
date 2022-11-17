import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';
import { RoundService } from './round.service';

@Module({
    providers: [CoreGateway, LobbyService, UserService, RoundService],
})
export class CoreModule {}
