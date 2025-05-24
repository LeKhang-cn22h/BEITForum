import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signupdto';
import { LoginData } from './schema/login.schema';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User,UserSchema } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(signUpData: SignUpDto) {
    try {
      const { name, phone, email, password, } = signUpData;
    
      let user = await this.userModel.findOne({ email });
      if (user) {
        throw new UnauthorizedException('Email đã được sử dụng');
      }

      let validPhone = await this.userModel.findOne({ phone });
      if (validPhone) {
        throw new UnauthorizedException('Số điện thoại đã được sử dụng');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const role =1;
      await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        phone,
        role
      });

      return {
        message: 'Tạo tài khoản thành công',
      };
    } catch (error) {
      if (error.code === 11000) {
        // Lấy trường bị trùng
        const field = Object.keys(error.keyValue)[0];
        // Lấy giá trị bị trùng
        const value = error.keyValue[field];
        throw new ConflictException(`Giá trị '${value}' của trường '${field}' đã được sử dụng`);
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký tài khoản '+ error);    
    }
  }


  async loginAsPhone(loginData:LoginData){
    try{
      const {phone, password}= loginData;
      let user = await this.userModel.findOne({phone});
      if (!user) {
        throw new UnauthorizedException('Không tìm thấy người dùng: '+phone+" "+password);
      }
      
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      const tokens = await this.generateUserTokens(
        user._id,
        user.email,
        user.name,
        user.phone,
      );

      const cacheKey = `user_${user._id}`;
      return {
        accessToken: tokens.accessToken,
        message: 'Đăng nhập thành công',
      };
    }
    catch{
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng nhập');
    }
  }

  async loginAsEmail(loginData:LoginData){
    try {
      const { email, password } = loginData;
      let user =
        await this.userModel.findOne({ email});

      if (!user) {
        throw new UnauthorizedException('Không tìm thấy người dùng: '+email+" "+password);
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      const tokens = await this.generateUserTokens(
        user._id,
        user.email,
        user.name,
        user.phone,
      );

      const cacheKey = `user_${user._id}`;
      return {
        accessToken: tokens.accessToken,
        message: 'Đăng nhập thành công',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng nhập');
    }
  }


  async generateUserTokens(userId, email, name, phone) {
    try {
      const accessToken = this.jwtService.sign({
        userId,
        email,
        name,
        phone,
      });
      return {
        accessToken,
      };
    } catch (error) {
      throw new InternalServerErrorException('Không thể tạo token truy cập');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
