import { Module, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schema/comment.schema';
import { Comment } from './schema/comment.schema';
import { ReplyComment, ReplyCommentSchema } from './schema/reply.schema';
import { Posts, PostsSchema } from 'src/posts/schema/post.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Notification, NotificationSchema } from 'src/notification/schema/notification.schema';
import { NotificationService } from 'src/notification/notification.service';

@Module({
   imports: [MongooseModule.forFeature([{
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Posts.name,
        schema: PostsSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: ReplyComment.name,
        schema: ReplyCommentSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
      ]),
      ],
  controllers: [CommentsController],
  providers: [CommentsService, NotificationService],
})
export class CommentsModule {}
