import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop()
  email: string;

  @Prop()
  otp: string;

  @Prop({ default: Date.now, expires: 300 }) // hết hạn sau 5 phút
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
