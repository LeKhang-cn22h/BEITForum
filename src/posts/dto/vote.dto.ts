
import { IsString, IsIn } from 'class-validator';

export class VoteDto {
  @IsString()
  userId: string;

  @IsIn(['upvote', 'downvote'])
  type: 'upvote' | 'downvote';
}
