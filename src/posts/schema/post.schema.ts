import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsOptional,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  isNumber,
  isNumberString,
} from 'class-validator';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Posts {
  @IsString()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: false })
  userId: Types.ObjectId;
  @IsString()
  @Prop({ required: false, unique: false })
  title: string;

  @IsString()
  @Prop({ required: true, unique: false })
  content: string;

  @IsString()
  @Prop({ required: true, unique: false })
  imageUrls: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Prop({ required: true, unique: false })
  tags: string[];

  @IsOptional()
  @IsString()
  @Prop({ required: true, unique: false })
  isPublished?: string;

  @Prop({ default: 0 })
  totalUpvotes: number;

  @Prop({ default: 0 })
  totalDownvotes: number;

  createdAt: Date;
  updatedAt: Date;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
