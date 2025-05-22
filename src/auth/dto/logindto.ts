import { IsEmail, IsOptional, IsNumberString, IsString, Matches, MinLength } from "class-validator";


export class LoginDto {

    @IsString()
    emailOrPhone: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/,{ message: 'password must contain at least one number'})
    password: string;

}
