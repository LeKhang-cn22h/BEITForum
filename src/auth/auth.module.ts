// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User, UserSchema } from './schema/user.schema';
import { BookMark, BookMarkSchema } from 'src/posts/schema/bookmark.schema';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowSchema } from 'src/follow/schema/follow.schema';
import { Otp, OtpSchema } from './schema/otp.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BookMark.name, schema: BookMarkSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Otp.name, schema: OtpSchema }, // thêm schema OTP
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
