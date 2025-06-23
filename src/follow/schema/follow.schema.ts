// entities/follow.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema()
export class Follow {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  followerIds: string[];
}

export const FollowSchema = SchemaFactory.createForClass(Follow);