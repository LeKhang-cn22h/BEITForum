import { IsString, IsOptional } from 'class-validator';

export class UpdateReportAccountDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
