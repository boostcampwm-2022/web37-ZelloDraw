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

    async startGame(lobbyId: string) {
        const game = await this.getGame(lobbyId);
        // TODO: Round 별 시간 관련 로직 추가 필요
        game.startGame();
        await this.gameLobbyRepository.save(game);
    }

    async submitQuizReply(lobbyId: string, user: User, reply: QuizReplyRequest) {
        const quizReply = new QuizReply(reply.type, reply.content, user);
        const game = await this.getGame(lobbyId);
        game.submitQuizReply(user, quizReply);
        await this.gameLobbyRepository.save(game);
    }

    async getCurRound(lobbyId: string): Promise<number> {
        const game = await this.getGame(lobbyId);
        return game.getCurRound();
    }

    async getCurrentRoundQuizReplyChain(lobbyId: string, user: User) {
        const game = await this.getGame(lobbyId);
        return game.getCurrentRoundQuizReplyChain(user);
    }

    async getSubmittedQuizRepliesCount(lobbyId: string) {
        const game = await this.getGame(lobbyId);
        return game.getSubmittedQuizRepliesCount();
    }

    async getNotSubmittedUsers(lobbyId: string): Promise<User[]> {
        const game = await this.getGame(lobbyId);
        return game.getNotSubmittedUsers();
    }

    async isAllUserSubmittedQuizReply(lobbyId: string): Promise<boolean> {
        const game = await this.getGame(lobbyId);
        return game.isAllUserSubmittedQuizReply();
    }

    async isLastRound(lobbyId: string): Promise<boolean> {
        const game = await this.getGame(lobbyId);
        return game.isLastRound();
    }

    async isHost(lobbyId: string, user: User): Promise<boolean> {
        const game = await this.getGame(lobbyId);
        return game.isHost(user);
    }

    async isPlaying(lobbyId: string): Promise<boolean> {
        const game = await this.getGame(lobbyId);
        return game.getIsPlaying();
    }

    async getGameHost(lobbyId: string): Promise<User> {
        const game = await this.getGame(lobbyId);
        return game.getHost();
    }

    async succeedHost(lobbyId) {
        const game = await this.getGame(lobbyId);
        game.succeedHost();
        await this.gameLobbyRepository.save(game);
    }

    async proceedRound(lobbyId: string) {
        const game = await this.getGame(lobbyId);
        game.proceedRound();
        await this.gameLobbyRepository.save(game);
    }

    async getQuizReplyChainsWhenGameEnd(lobbyId: string): Promise<undefined | QuizReplyChain[]> {
        const game = await this.getGame(lobbyId);
        return game.getQuizReplyChains();
    }

    async getIsWatchedQuizReplyChain(lobbyId: string, replyChainIdx: number): Promise<boolean> {
        const game = await this.getGame(lobbyId);
        return game.getIsWatchedQuizReplyChain(replyChainIdx);
    }

    async watchQuizReplyChain(lobbyId: string, bookIdx: number) {
        const game = await this.getGame(lobbyId);
        game.watchQuizReplyChain(bookIdx);
        await this.gameLobbyRepository.save(game);
    }

    async leaveWhenPlayingGame(user: User, lobbyId: string) {
        const game = await this.getGame(lobbyId);
        game.leaveWhenPlayingGame(user);
        if (game.getNumOfAliveUsers() === 0) {
            await this.gameLobbyRepository.delete(game);
        } else {
            await this.gameLobbyRepository.save(game);
        }
        await this.gameLobbyRepository.save(game);
    }

    async quitGame(lobbyId: string) {
        const game = await this.getGame(lobbyId);
        game.quitGame();
        await this.gameLobbyRepository.save(game);
    }

    async getGame(lobbyId: string): Promise<GameLobby> {
        return await this.gameLobbyRepository.findById(lobbyId);
    }
}
