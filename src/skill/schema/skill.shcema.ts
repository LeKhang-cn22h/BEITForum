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

export type SkillDocument = Skill & Document;

@Schema()
export class Skill {
  @IsString()
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 0 })
  totalUser: number;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
