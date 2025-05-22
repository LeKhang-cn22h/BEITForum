import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User,UserSchema } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(signUpData: SignUpDto) {
    try {
      const { email, password, name, phone } = signUpData;

      let user =
        (await this.userModel.findOne({ email }));

      if (user) {
        throw new UnauthorizedException('Email đã được sử dụng');
      }

      let validPhone =
        (await this.userModel.findOne({ phone }));

      if (validPhone) {
        throw new UnauthorizedException('Số điện thoại đã được sử dụng');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        phone
      });

      return {
        message: 'Tạo tài khoản thành công',
      };
    } catch (error) {
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký tài khoản: '+error);
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
