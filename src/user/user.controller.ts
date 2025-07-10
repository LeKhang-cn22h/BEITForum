import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Optional,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/userdto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { BanUserDto } from './dto/ban-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getall')
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Get('get/:_id')
  findOne(@Param('_id') id: string) {
    return this.userService.findUser(id);
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(updateUserDto);
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    console.log('Uploaded files:', file);

    return this.userService.updateUser(id, updateUserDto, file);
  }

  @Post()
  getUserInfo(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('ban/:id')
  async banUser(@Param('id') id: string, @Body() banDto: BanUserDto) {
    return this.userService.banUser(id, banDto.durationInDays);
  }

  @Put('signOut/:userId/:fcmToken')
  async signOut(
    @Param('userId') userId: string,
    @Param('fcmToken') fcmToken: string,
  ) {
    return await this.userService.signOut(userId, fcmToken);
  }
}
