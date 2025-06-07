import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './schema/post.schema';
import { Vote, VoteSchema } from 'src/vote/schema/vote.schema';
import { UserSchema } from 'src/auth/schema/login.schema';
import { User } from 'src/auth/schema/user.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BookMark, BookMarkSchema } from './schema/bookmark.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Posts.name,
        schema: PostsSchema,
      },
      {
        name: Vote.name,
        schema: VoteSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },{
        name: BookMark.name,
        schema: BookMarkSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
