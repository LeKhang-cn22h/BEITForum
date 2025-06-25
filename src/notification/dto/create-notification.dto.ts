export class CreateNotificationDto {
  receiverId: string;
  title: string;
  body: string;
  data: {
    postId: string;
    userId: string;
  };
}
