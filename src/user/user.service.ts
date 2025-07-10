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
import { UserDto } from './dto/userdto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schema/user.schema';
import { error } from 'console';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { messaging } from 'firebase-admin';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  create(createUserDto: UserDto) {
    return 'This action adds a new user';
  }

  async findAllUser() {
    try {
      let user = await this.userModel.find();
      if (!user) {
        throw new UnauthorizedException('Không có user nào');
      }
      return user;
    } catch {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng nhập');
    }
  }

  async findUser(_id: String) {
    try {
      let user = await this.userModel.findOne({ _id });
      return { message: 'Lấy thành công', user };
    } catch {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updateFields: Partial<UpdateUserDto> = {};

      // Nếu có file avatar thì upload lên Cloudinary, rồi lấy URL lưu vào updateFields.avatar
      if (file) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            id,
            'avatar',
            file,
          );
          updateFields.avatar = uploadResult.secure_url;
          console.log('Avatar đã tải lên:', updateFields.avatar);
        } catch (error) {
          console.error('Lỗi Cloudinary:', error);
          throw new BadRequestException('Lỗi khi tải avatar lên Cloudinary');
        }
      }

      // Bỏ avatar ra khỏi DTO để tránh ghi đè URL vừa upload (nếu có)
      const { avatar, password, ...otherFields } = updateUserDto;

      // Gộp các field cập nhật (không null, undefined) + avatar nếu có
      const updateData = Object.fromEntries(
        Object.entries(otherFields).filter(
          ([_, value]) => value !== null && value !== undefined,
        ),
      );

      if (updateFields.avatar) {
        updateData.avatar = updateFields.avatar;
      }

      if (password) {
        const bcrypt = require('bcrypt');
        updateData.password = await bcrypt.hash(password, 10);
      }
      if (typeof updateUserDto.skill === 'string') {
        try {
          console.log('Sau khi parse skill ' + JSON.parse(updateUserDto.skill));
          updateData.skill = JSON.parse(updateUserDto.skill);
          console.log(updateData);
        } catch (err) {
          throw new BadRequestException(
            'Trường skills không phải là JSON hợp lệ',
          );
        }
      }

      if (typeof updateUserDto.certificate === 'string') {
        try {
          console.log(
            'Sau khi parse certificate ' +
              JSON.parse(updateUserDto.certificate),
          );
          updateData.certificate = JSON.parse(updateUserDto.certificate);
          console.log(updateData);
        } catch (err) {
          throw new BadRequestException(
            'Trường Certificate không phải là JSON hợp lệ',
          );
        }
      }

      if (Object.keys(updateData).length > 0) {
        Object.assign(user, updateData);
        await user.save();
      }

      return { message: 'Cập nhật thông tin thành công', avatar: user.avatar };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async banUser(id: string, durationInDays: number) {
    const user = (await this.userModel.findById(id)) as UserDocument;
    if (!user) throw new NotFoundException('Không tìm thấy user');

    const now = new Date();
    const bannedUntil = new Date(
      now.getTime() + durationInDays * 24 * 60 * 60 * 1000,
    );

    user.isBanned = true;
    user.bannedUntil = bannedUntil;
    await user.save();

    return {
      message: `User bị khóa đến ${bannedUntil.toISOString()}`,
      bannedUntil,
    };
  }

  async signOut(userId: string, fcmToken: string) {
    const user = (await this.userModel.findById(userId)) as UserDocument;
    if (!user) throw new NotFoundException('Không tìm thấy user');
    const listFcmToken = user.fcmToken ?? [];
    const result = listFcmToken.filter((item) => item !== fcmToken);
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { fcmToken: result } },
    );
    return { message: 'Đăng xuất tài khoản thành công' };
  }
}
