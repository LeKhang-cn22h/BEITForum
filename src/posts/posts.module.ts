import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts,PostsSchema } from './schema/post.schema';
import { Vote, VoteSchema } from 'src/vote/schema/vote.schema';

@Module({
  imports: [MongooseModule.forFeature([{
      name: Posts.name,
      schema: PostsSchema,
    },
      {
        name: Vote.name,
        schema: VoteSchema,
      }
    ])
    ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
