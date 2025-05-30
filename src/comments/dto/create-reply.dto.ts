import { IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  userId: string;

  @IsString()
  commentId: string;

  @IsString()
  content: string;
}
