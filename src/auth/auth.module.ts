import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { BookMark, BookMarkSchema } from 'src/posts/schema/bookmark.schema';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowSchema } from 'src/follow/schema/follow.schema';


@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema,
  },
  {
    name: BookMark.name,
    schema: BookMarkSchema,
  },{
    name: Follow.name,
    schema: FollowSchema,
  },
  ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
