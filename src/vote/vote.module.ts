import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schema/vote.schema';
import { Posts, PostsSchema } from 'src/posts/schema/post.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { NotificationService } from 'src/notification/notification.service';
import { Notification, NotificationSchema } from 'src/notification/schema/notification.schema';

@Module({
  imports: [MongooseModule.forFeature([{
        name: Vote.name,
        schema: VoteSchema,
      },
      {
        name: Posts.name, // Assuming you have a Post schema defined elsewhere
        schema: PostsSchema, // Replace with actual Post schema import if needed
      },
      {
        name: User.name, // Assuming you have a User schema defined elsewhere
        schema: UserSchema, // Replace with actual User schema import if needed
      },
      {
        name: Notification.name,
        schema: NotificationSchema
      }
      ])
      ],
  controllers: [VoteController],
  providers: [VoteService, NotificationService],
})
export class VoteModule {}
