import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: false})
  name: string;

  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;
  @Prop({ required: true })
  password: string;

  role:string;
}

export const UserSchema = SchemaFactory.createForClass(User);
