import { IsString, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';

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
    @IsBoolean()
    isPublished?: boolean;
}
