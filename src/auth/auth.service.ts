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
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(SignUpData:SignUpDto): Promise<any> {
    try {
      const { email, password, name, phone } = SignUpData;
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) throw new Error('Email đã được sử dụng');

      const hashed = await bcrypt.hash(password, 10);
      const user = new this.userModel({ email, phone, name, password: hashed });
      await user.save();
      return { message: 'User registered successfully' };
    } catch (error) {
        throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký tài khoản');
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
