import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import{Document,Types} from 'mongoose';
@Schema({timestamps:true})
export class ReportAccount extends Document{
    @Prop({type: Types.ObjectId, ref:'User',required:true})
    reportedUserId:Types.ObjectId;
    @Prop({type:Types.ObjectId, ref:'User',required:true})
    reporterUserId:Types.ObjectId;
    @Prop({required:true})
    reason:string;
}
export const ReportAccountSchema=SchemaFactory.createForClass(ReportAccount);
