import { IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;
}
