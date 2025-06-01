import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
<<<<<<< HEAD
import { ReportAccountModule } from './report-account/report-account.module';
import { ReportPostModule } from './report-post/report-post.module';

=======
import { VoteModule } from './vote/vote.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
>>>>>>> 05def0602a3b33c49e742a0977a2c72044632514
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return {uri};
      },
      inject: [ConfigService],
    }), 
<<<<<<< HEAD
    AuthModule, PostsModule, CommentsModule, ReportAccountModule, ReportPostModule
=======
    AuthModule, PostsModule, CommentsModule, UserModule, CloudinaryModule
>>>>>>> 05def0602a3b33c49e742a0977a2c72044632514
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
