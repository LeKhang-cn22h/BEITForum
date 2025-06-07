import { IsOptional, IsInt, Min } from 'class-validator';
import { Expose } from 'class-transformer';

export class BanUserDto {
  @IsOptional()
  @Expose()
  reason?: string;

  @Expose()
  @IsInt()
  @Min(1)
  durationInDays: number;
}
