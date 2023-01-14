import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';
import { LobbyService } from './lobby.service';
import { UserService } from './user.service';
import { GameService } from './game.service';
import { GameLobbyRepository } from './gamelobby.repository';
import { GameResultModule } from '../gameResult/gameResult.module';
import { UserRepository } from './user.repository';
import { BullModule } from '@nestjs/bull';
import { TestService } from './test.service';

@Module({
    imports: [
        GameResultModule,
        BullModule.registerQueue({
            name: 'core',
        }),
    ],
    providers: [
        CoreGateway,
        LobbyService,
        UserService,
        GameService,
        GameLobbyRepository,
        UserRepository,
    ],
    exports: [UserService, LobbyService, GameService, CoreGateway],
})
export class CoreModule {}
