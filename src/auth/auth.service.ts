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
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,

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
      const role =signUpData.role;
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
        user.role
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
      console.log("Dang nhap nhu email")

      const { email, password } = loginData;
      let user =
        await this.userModel.findOne({ email});
      console.log("Da tim theo email")

      if (!user) {
        throw new UnauthorizedException('Không tìm thấy người dùng: '+email+" "+password);
      }
      console.log("Co tk co email")

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }
      console.log("dung mat khau")

      const tokens = await this.generateUserTokens(
        user._id,
        user.email,
        user.name,
        user.phone,
        user.role
      );
            console.log("Da tao token")

      return {
        accessToken: tokens.accessToken,
        message: 'Đăng nhập thành công',
      };
      } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng nhập: ' + error.message);
    }

  }


  async generateUserTokens(userId, email, name, phone, role) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log('>> JWT SECRET =', secret);
      const accessToken = this.jwtService.sign(
        { userId, email, name, phone,role },
        { secret }, // 👈 truyền secret trực tiếp để test
      );
      return { accessToken }; // ✅ trả về object có accessToken
    } catch (error) {
      throw new InternalServerErrorException('Không thể tạo token truy cập');
    }
  }

}
