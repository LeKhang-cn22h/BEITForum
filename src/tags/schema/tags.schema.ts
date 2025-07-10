import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tags & Document;

@Schema({ timestamps: true })
export class Tags {
  @Prop({ required: true, unique: true })
  name: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);