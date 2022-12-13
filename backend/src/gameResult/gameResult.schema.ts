import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class QuizReply {
    @Prop()
    author: string;

    @Prop()
    content: string;

    @Prop()
    type: string;
}
export const QuizReplySchema = SchemaFactory.createForClass(QuizReply);

@Schema({ _id: false })
export class QuizReplyChain {
    @Prop({
        type: [QuizReplySchema],
        default: [],
    })
    quizReplyList: QuizReply[];
}
export const QuizReplyChainSchema = SchemaFactory.createForClass(QuizReplyChain);

export type GameResultDocument = HydratedDocument<GameResult>;
@Schema()
export class GameResult {
    @Prop()
    host: string;

    @Prop([String])
    user: string[];

    @Prop()
    maxRound: number;

    @Prop({ type: [QuizReplyChainSchema], default: [] })
    quizReplyChains: QuizReplyChain[];

    @Prop(Date)
    gameStartDate: Date;

    @Prop({ type: Date, default: Date.now })
    gameEndDate: Date;
}
export const GameResultSchema = SchemaFactory.createForClass(GameResult);
