import { IsString, IsNotEmpty } from "class-validator";
export class CreateReportAccountDto{
    @IsNotEmpty()
    @IsString()
    reportedUserId:string;
    @IsNotEmpty()
    @IsString()
    reporterUserId:string;

    @IsNotEmpty()
    @IsString()
    reason:string;
}