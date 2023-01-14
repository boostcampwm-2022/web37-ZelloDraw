import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { GameService } from '../core/game.service';
import { CoreGateway } from '../core/core.gateway';

@Processor('core')
export class CoreProcessor {
    constructor(
        private readonly gameService: GameService,
        private readonly coreGateway: CoreGateway,
    ) {}

    @Process('submit-quiz-reply')
    async handleTranscode(job: Job) {
        await this.gameService.submitQuizReply(
            job.data.user.lobbyId,
            job.data.user,
            job.data.request.quizReply,
        );
        if (await this.gameService.isAllUserSubmittedQuizReply(job.data.user.lobbyId)) {
            await this.coreGateway.proceedRound(job.data.user);
        } else {
            const repliesCount = await this.gameService.getSubmittedQuizRepliesCount(
                job.data.user.lobbyId,
            );
            this.coreGateway.broadCastQuizReplySubmitted(repliesCount, job.data.user);
        }
    }
}
