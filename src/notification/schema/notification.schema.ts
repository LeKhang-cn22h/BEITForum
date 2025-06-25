import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  fcmToken: Types.ObjectId;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ type: Types.ObjectId, ref: 'posts', required: true })
  postId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
