import { Controller, Get, Post, Param } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId/:followerId')
  async toggleFollow(
    @Param('userId') userId: string,
    @Param('followerId') followerId: string,
  ) {
    return await this.followService.toggleFollow(userId, followerId);
  }

  // Get followers of a user
  @Get(':userId')
  async getFollowers(@Param('userId') userId: string) {
    return await this.followService.getFollowers(userId);
  }
  @Get('random/:userId/:size')
async getRandomUsers(@Param('size') size: string, @Param('userId') userId: string) {
    return await this.followService.getRandomUsers(size, userId);
  }
}