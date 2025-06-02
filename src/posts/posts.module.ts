import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts,PostsSchema } from './schema/post.schema';
import { Vote, VoteSchema } from 'src/vote/schema/vote.schema';
import { UserSchema } from 'src/auth/schema/login.schema';
import { User } from 'src/auth/schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{
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
      }
    ])
    ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
