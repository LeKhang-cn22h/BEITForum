import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Certificate,Skill } from '../../auth/schema/user.schema';


export class UserDto {
    @Prop({ required: false, unique: false})
    name: string;
  
    @Prop({ required: false, unique: false })
    email: string;
  
    @Prop({ required: false, unique: true })
    phone: string;
  
    @Prop({ required: false })
    password: string;
  
    @Prop({ required: false, unique: false})
    username: string;
    
    @Prop({ required: false, unique: false})
    avatar: string;
    
    @Prop({ required: false, unique: false})
    introduce: string;
    
    @Prop({ required: false, unique: false})
    totalPost: string;
    
    @Prop({ required: false, unique: false})
    totalComment: string;
    
    @Prop({ required: false, unique: false, default:[]})
    certificate: Certificate[];
    
    @Prop({ required: false, unique: false})
    isBanned: string;
    
    @Prop({ required: false, unique: false, default:[]})
    skills: Skill[];

}
