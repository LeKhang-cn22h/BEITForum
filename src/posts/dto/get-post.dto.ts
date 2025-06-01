import { IsArray, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetPostDto {
    @IsOptional()
    @IsString()
    userId?: string;
    @IsOptional()
    @IsString()
    title?: string;
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number;
}