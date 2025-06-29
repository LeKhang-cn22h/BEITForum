import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportPostService } from './report-post.service';
import { ReportPostController } from './report-post.controller';
import { ReportPost, ReportPostSchema } from './schema/report-post.schema';
import { Posts, PostsSchema } from '../posts/schema/post.schema'; 
import { User, UserSchema } from '../auth/schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AiEvalService } from 'src/ai/ai-eval.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportPost.name, schema: ReportPostSchema },
      { name: 'Posts', schema: PostsSchema }
    ]),
    ConfigModule,
  ],
  controllers: [ReportPostController],
  providers: [ReportPostService,AiEvalService],
})
export class ReportPostModule {}
