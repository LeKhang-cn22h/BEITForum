import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = ReplyComment & Document;

@Schema({ timestamps: true })
export class ReplyComment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'comment', required: true })
  commentId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const ReplyCommentSchema = SchemaFactory.createForClass(ReplyComment);
