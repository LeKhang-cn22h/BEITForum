import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('find/:id')
  findNotificationGroupByUserId(@Param('id') userId: string) {
    if (!userId) {
      return {
        message: 'userId is required',
        statusCode: 400,
      };
    }
    return this.notificationService.findNotificationGroupByUserId(userId);
  }

  @Patch('readNotification/:id')
  readNotification(@Param('id') idNotification: string) {

    return this.notificationService.ReadNotification(idNotification);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
