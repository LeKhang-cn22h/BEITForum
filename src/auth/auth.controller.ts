import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignUpDto } from './dto/signupdto';
import { LoginDto } from './dto/logindto';
import { isNumber, isString } from 'class-validator';
import { LoginData } from './schema/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async registerUser(@Body() signUpData: SignUpDto) {
    return this.authService.registerUser(signUpData);
  }

  @Post("login")
  async login(@Body() loginDto:LoginDto){
    
    const isPhone = /^\d{10,11}$/.test(loginDto.emailOrPhone);

    if (isPhone){
      const loginData: LoginData = {
        email:"",
        phone: loginDto.emailOrPhone,
        password: loginDto.password,
      };
      return this.authService.loginAsPhone(loginData)
    }
    else{
      const loginData: LoginData = {
          email:loginDto.emailOrPhone,
          phone:"",
          password:loginDto.password
      }
      return this.authService.loginAsEmail(loginData)
    }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
