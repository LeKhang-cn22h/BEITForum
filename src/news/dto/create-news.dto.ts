import { IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  userId: String;

  @IsString()
  title: String;

  @IsString()
  content: String;

  @IsString()
  img: String;
}
