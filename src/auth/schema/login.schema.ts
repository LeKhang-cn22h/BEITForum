import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsNumberString, IsString, Matches, MinLength } from "class-validator";
import { Document } from 'mongoose';

@Schema()
export class LoginData {    
    @IsEmail()
    @Prop({ unique: true,required: false })
    email: string;

    @IsNumberString()
    @Prop({ unique: true,required: false })
    phone: string;

    @Prop({ required: true })
    password: string;

    @IsString()
    fcmToken: {
        type: string, // Mảng chuỗi
        default: [],    // Rất quan trọng để tránh undefined
    }
}

export const UserSchema = SchemaFactory.createForClass(LoginData);
