import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignUpDto } from './dto/signupdto';
import { LoginData } from './schema/login.schema';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';
import { BookMark } from 'src/posts/schema/bookmark.schema';
import { Follow } from 'src/follow/entities/follow.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
     @InjectModel(BookMark.name) private BookMarkModel: Model<BookMark>,
     @InjectModel(Follow.name) private FollowModel: Model<Follow>,

  ) {}

  async registerUser(signUpData: SignUpDto) {
    try {
      const { name, phone, email, password } = signUpData;

      let user = await this.userModel.findOne({ email });
      if (user) {
        throw new UnauthorizedException('Email đã được sử dụng');
      }

      let validPhone = await this.userModel.findOne({ phone });
      if (validPhone) {
        throw new UnauthorizedException('Số điện thoại đã được sử dụng');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const registedUser = await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        phone,
      });
      const savedUser = await registedUser.save();
      // Khởi tạo bookmark cho người dùng mới
      await this.initializeBookMark(savedUser._id.toString());
      await this.initializeFollow(savedUser._id.toString());

      return {
        message: 'Tạo tài khoản thành công',
      };
    } catch (error) {
      if (error.code === 11000) {
        // Lấy trường bị trùng
        const field = Object.keys(error.keyValue)[0];
        // Lấy giá trị bị trùng
        const value = error.keyValue[field];
        throw new ConflictException(
          `Giá trị '${value}' của trường '${field}' đã được sử dụng`,
        );
      }
      if (error.code = 401){
        throw new UnauthorizedException(
          'Tài khoản đã đăng kí',
        );
      }
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi khi đăng ký tài khoản ' + error,
      );
    }
  }

  async loginAsPhone(loginData: LoginData) {
    try {
      const { phone, password } = loginData;
      let user = await this.userModel.findOne({ phone });
      if (!user) {
        throw new UnauthorizedException(
          'Không tìm thấy người dùng: ' + phone + ' ' + password,
        );
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }
      console.log('Ngoài if', user.isBanned);
      if (user.isBanned) {
        console.log('Trong if', user.isBanned);
        return {
          accessToken: null,
          message: 'Tài khoản của bạn đã bị khóa',
        };
      }
      const tokens = await this.generateUserTokens(
        user._id,
        user.email,
        user.name,
        user.phone,
        user.role,
      );

      const cacheKey = `user_${user._id}`;
      return {
        accessToken: tokens.accessToken,
        message: 'Đăng nhập thành công',
      };
    } catch {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng nhập');
    }
  }

  async loginAsEmail(loginData: LoginData) {
    try {
      console.log('Dang nhap bang email');

      const { email, password } = loginData;
      let user = await this.userModel.findOne({ email });
      console.log('Da tim theo email');

      if (!user) {
        throw new UnauthorizedException(
          'Không tìm thấy người dùng: ' + email + ' ' + password,
        );
      }

      console.log('Co tk co email');
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }
      console.log('dung mat khau');

      if (user.isBanned) {
        console.log('Tài khoản đã bị khóa');
        return {
          accessToken: null,
          message: 'Tài khoản của bạn đã bị khóa',
        };
      }
      const tokens = await this.generateUserTokens(
        user._id,
        user.email,
        user.name,
        user.phone,
        user.role,
      );
      console.log('Da tao token');

      return {
        accessToken: tokens.accessToken,
        message: 'Đăng nhập thành công',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi khi đăng nhập: ' + error.message,
      );
    }
  }

  async generateUserTokens(userId, email, name, phone, role) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log('>> JWT SECRET =', secret);
      const accessToken = this.jwtService.sign(
        { userId, email, name, phone, role },
        { secret, expiresIn: '7d' }, // 👈 truyền secret trực tiếp để test
      );
      console.log('>> accessToken =', accessToken);
      return { accessToken }; // ✅ trả về object có accessToken
    } catch (error) {
      throw new InternalServerErrorException('Không thể tạo token truy cập');
    }
  }

  // khoi tao bookmark cho user khi user moi dang ky
private async initializeBookMark(userId: string) {
  try {
    const bookmarkRecord = new this.BookMarkModel({
      userId: userId,
      postId: [],
    });
    if(bookmarkRecord) {
      await bookmarkRecord.save();
    }
  } catch (error) {
    console.error('Error initializing bookmark:', error);
    throw new InternalServerErrorException('Failed to initialize bookmark');
  }
}
private async initializeFollow(userId: string) {
  try {
    const FollowRecord = new this.FollowModel({
      userId: userId,
      postId: [],
    });
    if(FollowRecord) {
      await FollowRecord.save();
    }
  } catch (error) {
    console.error('Error initializing bookmark:', error);
    throw new InternalServerErrorException('Failed to initialize bookmark');
  }
}

}
