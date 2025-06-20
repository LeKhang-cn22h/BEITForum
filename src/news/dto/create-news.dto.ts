import { IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  adminId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  img: string;
}
