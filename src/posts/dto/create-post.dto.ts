import { IsString, IsOptional, IsBoolean, IsArray, IsNumber, Min } from 'class-validator';

export class CreatePostDto {
    @IsString()
    userId: string;

    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    isPublished?: string;

    
}
