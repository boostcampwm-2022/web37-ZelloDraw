import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';
import { GameService } from './game.service';
import { GameLobbyRepository } from './gamelobby.repository';
import { GameResultModule } from '../gameResult/gameResult.module';
import { UserRepository } from './user.repository';

@Module({
    imports: [GameResultModule],
    providers: [
        CoreGateway,
        LobbyService,
        UserService,
        GameService,
        GameLobbyRepository,
        UserRepository,
    ],
    exports: [UserService],
})
export class CoreModule {}
