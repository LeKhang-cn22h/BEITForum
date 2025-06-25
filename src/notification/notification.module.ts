import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Comment, CommentSchema } from 'src/comments/schema/comment.schema';

@Module({
 imports: [
  MongooseModule.forFeature([
    {
      name: Notification.name,
      schema: NotificationSchema,
    },
    {
      name: User.name,
      schema: UserSchema,
    }
  ]),

    ],
  controllers: [NotificationController],
  providers: [NotificationService],
  
})
export class NotificationModule {}
