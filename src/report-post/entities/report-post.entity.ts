import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongodb";
@Schema({timestamps:true})
export class ReportPost {}
