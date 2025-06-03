import { IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  adminId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  img: string;
}
