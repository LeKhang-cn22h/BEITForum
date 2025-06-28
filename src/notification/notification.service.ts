import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import * as admin from 'firebase-admin';
import { Notification } from './schema/notification.schema';
import { CreateNotificationTopicDto } from './dto/create-topic-notification';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Notification.name)
    private NotificationModel: Model<Notification>,
  ) {}
  async createNotification(dto: CreateNotificationDto) {
    const { receiverId, title, body, data } = dto;

    const user = await this.UserModel.findById(receiverId);
    if (!user) {
      throw new Error('Người nhận không tồn tại');
    }

    const sender = await this.UserModel.findById(data.userId);
    if (!sender) {
      throw new Error('Người gửi không tồn tại');
    }
    // Gửi FCM
    for (const token of user.fcmToken) {
      try {
        console.log('Sending notification to token:', token);
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
            { $pull: { fcmToken: token } },
          );
          console.log(`Removed invalid FCM token: ${token}`);
        }
        console.error('FCM error for token:', token, error);
      }
    }

    // Lưu DB
    await this.NotificationModel.create({
      userReceiveNotificationId: receiverId,
      title,
      content: `${sender.name} commented on your post`,
      postId: data.postId,
      isRead: false,
    });
  }

  async createNotificationTopic(dto: CreateNotificationTopicDto) {
    const { receiverId, title, content, userId } = dto;
    const sender = await this.UserModel.findById(userId);
    if (!sender) {
      throw new Error('Người gửi không tồn tại');
    }
    // Gửi FCM
    try {
      await admin.messaging().send({
        topic: 'all_users',
        notification: {
          title,
          body: content,
        },
        data: { userId },
      });
    } catch (error) {
      console.error('FCM error for Topic:', error);
    }

    // Lưu DB
    await this.NotificationModel.create({
      userReceiveNotificationId: receiverId,
      title,
      content,
      isRead: false,
    });
  }

  async findAll() {
    try {
      const listNotification = await this.NotificationModel.find();
      return { message: 'Lấy thành công tất cả thông báo', listNotification };
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw new Error('Failed to fetch notification');
    }
  }

  async findNotificationGroupByUserId(userId: string) {
    const notifications = await this.NotificationModel.find({
      $or: [
        { userReceiveNotificationId: userId },
        { userReceiveNotificationId: 'Tất cả' },
        { userReceiveNotificationId: null },
      ],
    }).sort({ createdAt: -1 }); // mới nhất trước
    return {
      message: `Danh sách thông báo của userId: ${userId}`,
      data: notifications,
    };
  }

  async ReadNotification(idNotification: string) {
    try {
      await this.NotificationModel.updateOne(
        { _id: new Types.ObjectId(idNotification) },
        { $set: { isRead: true } },
      );
      return `🔔 Notification with ID ${idNotification} has been marked as read`;
    } catch (error) {
      throw new Error(`❌ Error updating notification: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Notification> {
    try {
      const notification = await this.NotificationModel.findById(id);

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      return notification;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw new Error('Failed to fetch notification');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
