import { Injectable } from '@nestjs/common';
import { VoteDto } from './dto/vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/posts/schema/post.schema';
import { Model } from 'mongoose';
import { Vote } from './schema/vote.schema';
import { use } from 'passport';

@Injectable()
export class VoteService {
   constructor(
      //@InjectModel(Posts.name) private PostsModel: Model<Posts>,
      @InjectModel(Vote.name) private VoteModel: Model<Vote>,
    ) {}

    async votes(postId: string, voteDto: VoteDto) {
      try {
        const { userId, type } = voteDto;
        console.log(userId, type);
        // Lay du lieu cua ca upvote va downvote dong thoi (parallel queries)
        const [upVoteData, downVoteData] = await Promise.all([
          this.VoteModel.findOne({ postId, type: 'upvote' }),
          this.VoteModel.findOne({ postId, type: 'downvote' })
        ]);
    
        // Kiem tra xem vote data da ton tai chua
        if (!upVoteData || !downVoteData) {
          throw new Error('Vote data not found for this post');
        }
    
        // Kiem tra trang thai vote hien tai cua user
        const hasUpvoted = this.hasUserVoted(upVoteData, userId);
        const hasDownvoted = this.hasUserVoted(downVoteData, userId);
    
        if (type === 'upvote') {
          // Xu ly upvote
          await this.handleUpvote(upVoteData, downVoteData, userId, hasUpvoted, hasDownvoted);
        } else if (type === 'downvote') {
          // Xu ly downvote
          await this.handleDownvote(upVoteData, downVoteData, userId, hasUpvoted, hasDownvoted);
        } else {
          throw new Error('Invalid vote type');
        }
    
        // Luu ca 2 ban ghi dong thoi
        await Promise.all([upVoteData.save(), downVoteData.save()]);
    
        // Tra ve ket qua voi so luong vote moi nhat
        return {
          success: true,
          upvotes: upVoteData.total,
          downvotes: downVoteData.total,
          userVote: type === 'upvote' && this.hasUserVoted(upVoteData, userId) ? 'upvote' :
                    type === 'downvote' && this.hasUserVoted(downVoteData, userId) ? 'downvote' : null
        };
    
      } catch (error) {
        console.error('Error processing votes:', error);
        throw new Error('Failed to process votes');
      }
    }
    
    // Ham kiem tra xem user da vote chua
    private hasUserVoted(voteData: any, userId: string): boolean {
      return voteData.userId.some((user: string) => user.toString() === userId.toString());
    }
    
    // Ham them user vao danh sach vote
    private addUserToVote(voteData: any, userId: string): void {
      if (!this.hasUserVoted(voteData, userId)) {
        voteData.userId.push(userId);
        voteData.total += 1; // Tang tong so luong
      }
    }
    
    // Ham xoa user khoi danh sach vote
    private removeUserFromVote(voteData: any, userId: string): void {
      const initialLength = voteData.userId.length;
      voteData.userId = voteData.userId.filter((user: string) => user.toString() !== userId.toString());
      
      // Chi giam total neu user thuc su bi xoa
      if (voteData.userId.length < initialLength) {
        voteData.total -= 1; // Giam tong so luong
      }
    }
    
    // Xu ly logic upvote
    private async handleUpvote(upVoteData: any, downVoteData: any, userId: string, hasUpvoted: boolean, hasDownvoted: boolean): Promise<void> {
      if (hasUpvoted && !hasDownvoted) {
        // User da upvote roi va chua downvote - xoa upvote 
        this.removeUserFromVote(upVoteData, userId);
      } else if (!hasUpvoted && hasDownvoted) {
        // User da downvote truoc do - chuyen sang upvote
        this.removeUserFromVote(downVoteData, userId); // Xoa khoi downvote
        this.addUserToVote(upVoteData, userId); // Them vao upvote
      } else if (!hasUpvoted && !hasDownvoted) {
        // User chua vote gi ca - them upvote
        this.addUserToVote(upVoteData, userId);
      }
      
    }
    
    // Xu ly logic downvote  
    private async handleDownvote(upVoteData: any, downVoteData: any, userId: string, hasUpvoted: boolean, hasDownvoted: boolean): Promise<void> {
      if (hasDownvoted && !hasUpvoted) {
        // User da downvote roi va chua upvote - xoa downvote
        this.removeUserFromVote(downVoteData, userId);
      } else if (!hasDownvoted && hasUpvoted) {
        // User da upvote truoc do - chuyen sang downvote
        this.removeUserFromVote(upVoteData, userId); // Xoa khoi upvote
        this.addUserToVote(downVoteData, userId); // Them vao downvote
      } else if (!hasDownvoted && !hasUpvoted) {
        // User chua vote gi ca - them downvote
        this.addUserToVote(downVoteData, userId);
      }
      
    }
    async getVoteByPostId(postId: string,userId: string) {
      try {
        // Lay du lieu cua ca upvote va downvote dong thoi
        const [upVoteData, downVoteData] = await Promise.all([
          this.VoteModel.findOne({ postId, type: 'upvote' }),
          this.VoteModel.findOne({ postId, type: 'downvote' })
        ]);
        // Kiem tra xem vote data da ton tai chua
        if (!upVoteData || !downVoteData) {
          throw new Error('Vote data not found for this post');
        }
    // Kiem tra trang thai vote hien tai cua user
        const hasUpvoted = this.hasUserVoted(upVoteData, userId);
        const hasDownvoted = this.hasUserVoted(downVoteData, userId);
    // Xac dinh trang thai vote cua user
        let userVoteStatus = "none";
        if (hasUpvoted) userVoteStatus = 'upvote';
        else if (hasDownvoted) userVoteStatus = 'downvote';
    
        return {
          userVote: userVoteStatus,
          upVoteData: {
            userId: upVoteData.userId,
            total: upVoteData.total
          },
          downVoteData: {
            userId: downVoteData.userId,
            total : downVoteData.total}
        };
      } catch (error) {
        console.error('Error getting user vote for post:', error);
        throw new Error('Failed to get user vote status');
      }
    }
}
