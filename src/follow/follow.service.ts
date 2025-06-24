import { Model, Types } from 'mongoose';
import { Follow } from './entities/follow.entity';
import { User } from 'src/auth/schema/user.schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private FollowModel: Model<Follow>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // toggle follow user
  async toggleFollow(userId: string, followerId: string) {
    try {
      if (userId === followerId) {
        throw new BadRequestException("You can't follow yourself");
      }

      let follow = await this.FollowModel.findOne({ userId }) as any;

      if (!follow) {
        // If no follow record exists, create a new one
        await this.FollowModel.create({
          userId,
          followerIds: [followerId],
        });

        return { message: 'Followed user', isFollowed: true };
      }

      const index = follow.followerIds.findIndex((id: string) => id === followerId);

      if (index > -1) {
        // If already followed → unfollow
        follow.followerIds.splice(index, 1);
        await follow.save();
        return { message: 'Unfollowed user', isFollowed: false };
      } else {
        // If not followed → add to followers
        follow.followerIds.push(followerId);
        await follow.save();
        return { message: 'Followed user', isFollowed: true };
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update follow status');
    }
  }

 // get list of followers with full user info
async getFollowers(userId: string) {
  try {
    const follow = await this.FollowModel.findOne({ userId }) as any;

    const followerIds = follow?.followerIds || [];

    // If no followers, return empty
    if (followerIds.length === 0) {
      return {
        followers: [],
        message: 'No followers yet',
      };
    }

    // Fetch user info of followers
    const followers = await this.userModel.find(
      { _id: { $in: followerIds.map(id => new Types.ObjectId(id)) } },
      { _id: 1, name: 1, avatar: 1 }
    ).lean();

    return {
      followers,
      count: followers.length,
      message: 'Followers retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting followers:', error);
    throw new InternalServerErrorException('Failed to get followers');
  }
}



async getRandomUsers(size: string, userId?: string) {
  try {
    const followerUserData = await this.FollowModel.findOne({ userId }) as any;
    const followedUserIds = followerUserData?.followerIds || [];
    const sizeNumber = parseInt(size, 10);

    const excludedIds = [...followedUserIds, userId].map(id => new Types.ObjectId(id));

    const randomUsers = await this.userModel.aggregate([
      {
        $match: {
          _id: { $nin: excludedIds },
        }
      },
      { $sample: { size: sizeNumber } },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
        }
      }
    ]);

    return {
      followers: randomUsers,
      count: randomUsers.length,
      message: 'Random users retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting random users:', error);
    throw new InternalServerErrorException('Failed to get random users');
  }
}

  
}