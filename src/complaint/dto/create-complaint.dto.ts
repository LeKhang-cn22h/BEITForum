import { IsOptional, IsString } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  img?: string;
}
