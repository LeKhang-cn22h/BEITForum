import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ReportPost extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true })
  reportedPostId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  reporterUserId: Types.ObjectId;

  @Prop({ required: true })
  reason: string;
  @Prop()
  createdAt: string;

   @Prop({
    type: {
      violationPercentage: Number,
      reason: String,
      shouldBan: Boolean,
    },
    default: null,
  })
  aiAnalysis?: {
    violationPercentage: number;
    reason: string;
    shouldBan: boolean;
  };

}

export const ReportPostSchema = SchemaFactory.createForClass(ReportPost); 
