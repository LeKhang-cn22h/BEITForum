import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsString } from 'class-validator';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Complaint {
  @IsString()
  @Prop({ required: true })
  userId: string;

  @IsString()
  @Prop({ required: true })
  title: string;

  @IsString()
  @Prop({ required: true })
  reason: string;

  @Prop({ default: '' })
  img: string;

  @Prop({
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    lowercase: true,
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  readonly createdAt: Date;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
