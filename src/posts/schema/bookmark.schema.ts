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
export class BookMark {
  @IsString()
  @Prop({  required: true, unique: true })
  userId: String;
  @Prop({  required: true })
  postId: String[];

}

export const BookMarkSchema = SchemaFactory.createForClass(BookMark);
