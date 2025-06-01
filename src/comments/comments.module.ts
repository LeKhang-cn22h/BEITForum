import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schema/comment.schema';
import { Comment } from './schema/comment.schema';
import { ReplyComment, ReplyCommentSchema } from './schema/reply.schema';
@Module({
   imports: [MongooseModule.forFeature([{
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: ReplyComment.name,
        schema: ReplyCommentSchema,
      },
      ])
      ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
