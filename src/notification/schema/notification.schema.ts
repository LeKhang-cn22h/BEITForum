import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop()
  userReceiveNotificationId: Types.ObjectId; // ✅ Đúng cách định nghĩa với @Prop

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'posts', required: false })
  postId: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean; // ✅ Đúng cách định nghĩa với @Prop
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
