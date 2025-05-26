import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsNumberString, IsString, Matches, MinLength, ArrayNotEmpty, IsArray, IsBoolean, isNumber, isNumberString } from "class-validator";
import mongoose, { Document, Types } from 'mongoose';

@Schema()
export class Posts {
    @IsString()
    @Prop({ unique: true, required: true })
    userId: string;

    @IsString()
    @Prop({ unique: true, required: false })
    title: string;

    @IsString()
    @Prop({ unique: true, required: true })
    content: string;

    @IsString()
    @Prop({ unique: true, required: true })
    imageUrl: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    tags: string[];

    @IsOptional()
    @IsBoolean()
    @Prop({ unique: true, required: true })
    isPublished?: boolean;

    @Prop({ type: [String], default: [] })
    upvotes: string[];

    @Prop({ type: [String], default: [] })
    downvotes: string[];


    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
    comments: Types.ObjectId[];
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
