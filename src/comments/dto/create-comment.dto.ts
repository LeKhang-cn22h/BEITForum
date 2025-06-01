import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  postId: string;

  @IsString()
  content: string;
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
