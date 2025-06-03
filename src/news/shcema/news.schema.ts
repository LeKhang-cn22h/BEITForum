import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class News {
  @IsString()
  @Prop({ required: true })
  adminId: string;

  @IsString()
  @Prop({ required: true })
  title: string;

  @IsString()
  @Prop({ required: true })
  content: string;

  @IsString()
  @Prop()
  img: string;

  readonly createdAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
