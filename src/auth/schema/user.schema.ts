import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: false, unique: true, sparse: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, unique: false, default: User.name })
  username: string;

  @Prop({
    required: false,
    unique: false,
    default:
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
  })
  avatar: string;

  @Prop({ required: false, unique: false, default: '' })
  introduce: string;

  @Prop({ required: false, unique: false, default: 0 })
  totalPost: number;

  @Prop({ required: false, unique: false, default: 0 })
  totalComment: number;

  @Prop({ required: false, unique: false, default: [] })
  certificate: Certificate[];

  @Prop({ required: false, unique: false, default: false })
  isBanned: boolean;

  @Prop({ default: null })
  bannedUntil: Date;

  @Prop({ required: false, unique: false, default: [] })
  skill: Skill[];

  @Prop ({ required: false, unique: false})
  fcmToken:string[];

  @Prop({ required: false, unique: false, default: Date.now })
  createdAt: Date;

  @Prop({ required: false, unique: false, default: 'user' })
  role: string;


}

@Schema()
export class Certificate {
  @Prop({ required: false, unique: false })
  _id: string;
  @Prop({ required: false, unique: false })
  name: string;
}

@Schema()
export class Skill {
  @Prop({ required: false, unique: false })
  _id: string;
  @Prop({ required: false, unique: false })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
