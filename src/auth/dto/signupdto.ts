import {
  IsEmail,
  IsOptional,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { Prop } from '@nestjs/mongoose';

export class SignUpDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Phone number must contain only numbers' })
  @Matches(/^\d{10,11}$/, { message: 'Phone number must be 10-11 digits' })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'password must contain at least one number',
  })
  password: string;

}
