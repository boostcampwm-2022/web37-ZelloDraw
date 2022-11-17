import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';

@Module({
    providers: [CoreGateway, LobbyService, UserService],
})
export class CoreModule {}
