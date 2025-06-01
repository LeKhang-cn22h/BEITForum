import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document, Types } from 'mongoose';

@Schema()
export class News {
  @IsString()
  @Prop({ require: true })
  userId: String;

  @IsString()
  @Prop({ require: true })
  title: String;

  @IsString()
  @Prop({ require: true })
  content: String;

  @IsString()
  @Prop({ require: true })
  img: String;
}

export const NewsSchema = SchemaFactory.createForClass(News);
