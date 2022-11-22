import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { GameLobbyRepository } from './gamelobby.repository';
import { QuizReply } from './quizReply.model';
import { QuizReplyRequest } from './game.dto';
import { QuizReplyChain } from './quizReplyChain.model';

@Injectable()
export class GameService {
    constructor(
        private readonly userService: UserService,
        private readonly gameLobbyRepository: GameLobbyRepository,
    ) {}

    startGame(lobbyId: string) {
        const game = this.gameLobbyRepository.findById(lobbyId);
        // TODO: Round 별 시간 관련 로직 추가 필요
        game.startGame(60);
        this.gameLobbyRepository.save(game);
    }

    submitQuizReply(lobbyId: string, user: User, reply: QuizReplyRequest) {
        const game = this.gameLobbyRepository.findById(lobbyId);
        const quizReply = new QuizReply(reply.type, reply.content, user);
        game.submitQuizReply(user, quizReply);
        this.gameLobbyRepository.save(game);
    }

    getCurrentRoundQuizReplyChain(lobbyId: string, user: User) {
        const game = this.gameLobbyRepository.findById(lobbyId);
        return game.getCurrentRoundQuizReplyChain(user);
    }

    proceedRound(lobbyId: string) {
        const game = this.gameLobbyRepository.findById(lobbyId);
        game.proceedRound();
        this.gameLobbyRepository.save(game);
    }

    getQuizReplyChainsWhenGameEnd(lobbyId: string): undefined | QuizReplyChain[] {
        const game = this.gameLobbyRepository.findById(lobbyId);
        return game.getQuizReplyChains();
    }
}
