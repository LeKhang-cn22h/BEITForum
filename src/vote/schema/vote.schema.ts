import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({ 
  timestamps: true, 
  collection: 'votes'
})
export class Vote {
  @Prop({ 
    type: [String], 
    required: true,
    default: [],
    index: true 
  })
  userId: string[];

  @Prop({ 
    type: String, 
    required: true,
    index: true ,
  })
  postId: string;

  @Prop({ 
    type: String, 
    required: true,
    enum: ['upvote', 'downvote'],
    lowercase: true
  })
  type: 'upvote' | 'downvote';

  @Prop({ 
    type: Number, 
    required: true,
    default: 0,
    min: 0
  })
  total: number;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
