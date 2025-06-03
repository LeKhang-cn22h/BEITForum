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
    @Prop({ default: 'pending' })
    status: 'pending' | 'approved' | 'rejected' | 'banned';

    @Prop()
    adminNote?: string;
     @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}
export const ReportAccountSchema=SchemaFactory.createForClass(ReportAccount);
