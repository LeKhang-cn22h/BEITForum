import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;
// id of parent comnment if this is a reply
  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentCommentId?: Types.ObjectId; 
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
