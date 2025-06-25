import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import * as admin from 'firebase-admin';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
        @InjectModel(User.name) private UserModel:Model<User>, 
        @InjectModel(Notification.name) private NotificationModel: Model<Notification>,
      ) {}
    async createNotification(dto: CreateNotificationDto) {
      const { receiverId, title, body, data } = dto;

      const user = await this.UserModel.findById(receiverId);
      if (!user) {
        throw new Error('Người nhận không tồn tại');
      }

      // Gửi FCM
      for (const token of user.fcmToken) {
        try {
          console.log("Sending notification to token:", token);
          await admin.messaging().send({
            token,
            notification: {
              title,
              body,
            },
            data,
          });
        } catch (error) {
          if (error.code === 'messaging/registration-token-not-registered') {
            await this.UserModel.updateOne(
              { _id: receiverId },
              { $pull: { fcmToken: token } }
            );
            console.log(`Removed invalid FCM token: ${token}`);
          }
          console.error("FCM error for token:", token, error);
        }
      }

      // Lưu DB
      await this.NotificationModel.create({
        userId: receiverId,
        title,
        content: `${data.userId} commented on your post`,
        postId: data.postId,
      });
    }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
