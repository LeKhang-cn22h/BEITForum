import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { VoteModule } from './vote/vote.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReportAccountModule } from './report-account/report-account.module';
import { ReportPostModule } from './report-post/report-post.module';
import { NewsModule } from './news/news.module';
import { ComplaintModule } from './complaint/complaint.module';
import { FollowModule } from './follow/follow.module';
import { NotificationModule } from './notification/notification.module';
import { BigqueryModule } from './bigquery/bigquery.module'; 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return { uri };
      },
      inject: [ConfigService],
    }),

    AuthModule,
    PostsModule,
    CommentsModule,
    ReportAccountModule,
    ReportPostModule,
    UserModule,
    NewsModule,
    VoteModule,
    CloudinaryModule,
    ComplaintModule,
    NotificationModule,
    BigqueryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

