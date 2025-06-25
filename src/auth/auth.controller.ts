import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signupdto';
import { LoginDto } from './dto/logindto';
import { LoginData } from './schema/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() signUpData: SignUpDto) {
    console.log(signUpData);

    return this.authService.registerUser(signUpData);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);

    const isPhone = /^\d{10,11}$/.test(loginDto.emailOrPhone);

    if (isPhone) {
      const loginData: LoginData = {
        email: '',
        phone: loginDto.emailOrPhone,
        password: loginDto.password,
        fcmToken: loginDto.fcmToken
      };
      return this.authService.loginAsPhone(loginData);
    } else {
      const loginData: LoginData = {
        email: loginDto.emailOrPhone,
        phone: '',
        password: loginDto.password,
        fcmToken: loginDto.fcmToken
      };
      return this.authService.loginAsEmail(loginData);
    }
  }
}
