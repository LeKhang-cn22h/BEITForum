import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsNumberString, IsString, Matches, MinLength, ArrayNotEmpty, IsArray, IsBoolean, isNumber, isNumberString } from "class-validator";
import mongoose, { Document, Types } from 'mongoose';

@Schema()
export class Posts {
    @IsString()
    @Prop({ required: true,unique:false })
    userId: string;

    @IsString()
    @Prop({ required: false })
    title: string;

    @IsString()
    @Prop({  required: true })
    content: string;

    @IsString()
    @Prop({  required: true })
    imageUrl: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @Prop({ required: true })
    tags: string[];
    

    @IsOptional()
    @IsString()
    @Prop({  required: true })
    isPublished?: string;

    @Prop({ default: 0 })
    totalUpvotes: number;
    
    @Prop({ default: 0 })
    totalDownvotes: number;
    createdAt: Date;
    updatedAt: Date;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
