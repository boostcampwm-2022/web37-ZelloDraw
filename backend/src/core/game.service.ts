import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { GameLobbyRepository } from './gamelobby.repository';
import { QuizReply } from './quizReply.model';
import { QuizReplyRequest } from './game.dto';
import { QuizReplyChain } from './quizReplyChain.model';
import { GameLobby } from './gameLobby.model';

@Injectable()
export class GameService {
    constructor(
        private readonly userService: UserService,
        private readonly gameLobbyRepository: GameLobbyRepository,
    ) {}

    startGame(lobbyId: string) {
        const game = this.getGame(lobbyId);
        // TODO: Round 별 시간 관련 로직 추가 필요
        game.startGame();
        this.gameLobbyRepository.save(game);
    }

    submitQuizReply(lobbyId: string, user: User, reply: QuizReplyRequest) {
        const game = this.getGame(lobbyId);
        const quizReply = new QuizReply(reply.type, reply.content, user);
        game.submitQuizReply(user, quizReply);
        this.gameLobbyRepository.save(game);
    }

    getCurrentRoundQuizReplyChain(lobbyId: string, user: User) {
        const game = this.getGame(lobbyId);
        return game.getCurrentRoundQuizReplyChain(user);
    }

    getSubmittedQuizRepliesCount(lobbyId: string) {
        const game = this.getGame(lobbyId);
        return game.getSubmittedQuizRepliesCount();
    }

    isAllUserSubmittedQuizReply(lobbyId: string): boolean {
        const game = this.getGame(lobbyId);
        return game.isAllUserSubmittedQuizReply();
    }

    proceedRound(lobbyId: string) {
        const game = this.getGame(lobbyId);
        game.proceedRound();
        this.gameLobbyRepository.save(game);
    }

    getQuizReplyChainsWhenGameEnd(lobbyId: string): undefined | QuizReplyChain[] {
        const game = this.getGame(lobbyId);
        return game.getQuizReplyChains();
    }

    getGame(lobbyId: string): GameLobby {
        return this.gameLobbyRepository.findById(lobbyId);
    }
}
