import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportPostService } from './report-post.service';
import { ReportPostController } from './report-post.controller';
import { ReportPost, ReportPostSchema } from './schema/report-post.schema';
import { Posts, PostsSchema } from '../posts/schema/post.schema'; 
import { User, UserSchema } from '../auth/schema/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportPost.name, schema: ReportPostSchema },
      { name: 'Posts', schema: PostsSchema }
    ])
  ],
  controllers: [ReportPostController],
  providers: [ReportPostService],
})
export class ReportPostModule {}
