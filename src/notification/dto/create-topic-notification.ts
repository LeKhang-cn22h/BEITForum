import { IsObject, IsString } from 'class-validator';

export class CreateNotificationTopicDto {
  @IsString()
  receiverId: string;
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  userId: string;
}
