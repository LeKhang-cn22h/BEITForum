import { IsString,IsNotEmpty } from "class-validator";
export class CreateReportPostDto {
    @IsString()
    @IsNotEmpty()
    reportedPostId:string;

    @IsNotEmpty()
    @IsString()
    reporterUserId:string;

    @IsNotEmpty()
    @IsString()
    reason:string;

}
