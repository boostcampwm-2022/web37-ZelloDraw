import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';

@Module({
    providers: [CoreGateway, LobbyService],
})
export class CoreModule {}
