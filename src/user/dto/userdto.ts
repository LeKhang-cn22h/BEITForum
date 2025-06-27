import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Certificate, Skill } from '../../auth/schema/user.schema';
import {
  IsArray,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// export class UserDto {
//   @Prop({ required: false, unique: false })
//   name: string;

//   @Prop({ required: false, unique: false })
//   email: string;

//   @Prop({ required: false, unique: true })
//   phone: string;

//   @Prop({ required: false })
//   password: string;

//   @Prop({ required: false, unique: false })
//   username: string;

//   @Prop({ required: false, unique: false })
//   avatar: string;

//   @Prop({ required: false, unique: false })
//   introduce: string;

//   @Prop({ required: false, unique: false })
//   totalPost: string;

//   @Prop({ required: false, unique: false })
//   totalComment: string;

//   @Prop({ required: false, unique: false, default: [] })
//   certificate: Certificate[];

//   @Prop({ required: false, unique: false })
//   isBanned: string;

//   @Prop({ required: false, unique: false, default: [] })
//   skill: Skill[];
// }
export class UserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Phone number must contain only numbers' })
  @Matches(/^\d{10,11}$/, { message: 'Phone number must be 10-11 digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'password must contain at least one number',
  })
  password?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  introduce?: string;

  @IsOptional()
  @IsString()
  totalPost?: string;

  @IsOptional()
  @IsString()
  totalComment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificate?: string[];

  @IsOptional()
  @IsString()
  isBanned?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skill?: string[];
}
