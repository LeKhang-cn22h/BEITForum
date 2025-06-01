import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './userdto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export class UpdateUserDto extends PartialType(UserDto) {}
