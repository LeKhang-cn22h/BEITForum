import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { ReplyComment } from './schema/reply.schema';
@Injectable()
export class CommentsService {
   constructor(
      @InjectModel(Comment.name) private CommentModel: Model<Comment>,
      @InjectModel(Comment.name) private ReplyCommentModel: Model<ReplyComment>
    ) {}
    // Tao comment
  async create(createCommentDto: CreateCommentDto) {
    try {
      const { userId, postId, content } = createCommentDto;
      const newComment = {
        userId,
        postId,
        content,
      };
      const createdComment = await this.CommentModel.create(newComment);

      return createdComment; 
      
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
      
    }
  }
// Lay danh sach comment
  async findAll() {
    try {
      return await this.CommentModel.find().exec();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }
// Lay comment theo id
  async findOne(id: string) {
    try {
      const comment = await this.CommentModel.findById(id).exec();
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching comment:', error);
      throw new Error('Failed to fetch comment');
    }
  }
 
  
// Lay comment theo postId
async findByPost(postId: string, page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;

    const comments = await this.CommentModel.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.CommentModel.countDocuments({ postId });

    return {
      comments: comments.map(comment => ({
        content: comment.content,
        userId: comment.userId,
        time:comment.createdAt
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching comments by post:', error);
    throw new Error('Failed to fetch comments for post');
  }
}

// Lay comment theo userId
  async findByUser(userId: string) {
    try {
      return await this.CommentModel.find({ userId }).exec();
    } catch (error) {
      console.error('Error fetching comments by user:', error);
      throw new Error('Failed to fetch comments for user');
    }
  }
// Cap nhat comment
  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const updatedComment = await this.CommentModel
        .findByIdAndUpdate(id, updateCommentDto, { new: true })
        .exec();
      
      if (!updatedComment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      
      return updatedComment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }
// Xoa comment
  async remove(id: string) {
    try {
      const deletedComment = await this.CommentModel.findByIdAndDelete(id).exec();
      
      if (!deletedComment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      
      return { message: 'Comment deleted successfully', deletedComment };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }
   async createReply(createCommentDto: CreateCommentDto) {

   }
}
