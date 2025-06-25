/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { Posts } from '../posts/schema/post.schema'
import { User } from '../auth/schema/user.schema'
import { ReplyComment } from './schema/reply.schema';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import * as admin from 'firebase-admin';
import { Notification } from 'src/notification/schema/notification.schema';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CommentsService {
   constructor(
      @InjectModel(Comment.name) private CommentModel: Model<Comment>,
      @InjectModel(Posts.name) private PostsModel:Model<Posts>,
      @InjectModel(User.name) private UserModel:Model<User>, 
      @InjectModel(Notification.name) private NotificationModel: Model<Notification>,
      @InjectModel(ReplyComment.name) private ReplyCommentModel: Model<ReplyComment>,
      private notificationService: NotificationService,
    ) {}
  // Tao comment
  async createComment(createCommentDto: CreateCommentDto) {
    try {
      const { userId, postId, content } = createCommentDto;
      const newComment = {
        userId,
        postId,
        content,
      };
      const createdComment = await this.CommentModel.create(newComment);
      const userComment = await this.UserModel.findById(userId);
      // 2. Lấy bài viết liên quan
      const postOwner = await this.PostsModel.findById(postId).populate<{userId: User & {_id: Types.ObjectId} }>("userId");
      // 3. Kiểm tra nếu người comment KHÔNG PHẢI chủ post thì mới gửi thông báo
      if (postOwner && postOwner.userId && postOwner.userId._id.toString() !== userId.toString()) {
        const notification = {
          receiverId: postOwner.userId._id.toString(),
          title: `${userComment?.username || 'Người dùng'} đã bình luận vào bài viết của bạn`,
          body: `${userComment?.username || ''} đã viết: ${content}`,
          data: {
            postId,
            commentId: createdComment._id.toString(),
            userId,
          },
        };

        // Gọi service notification
        await this.notificationService.createNotification(notification);
      }
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

    const comments = await this.CommentModel.aggregate([
      { $match: { postId } },
      { $sort: { createdAt: -1, _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          userIdObj: { $toObjectId: "$userId" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ["$user.name", 0] },
          avatar: { $arrayElemAt: ["$user.avatar", 0] }
        }
      },
      {
        $project: {
          user: 0,
          userIdObj: 0
        }
      }
    ]);

    const total = await this.CommentModel.countDocuments({ postId });

    return {
      comments: comments.map(comment => ({
        content: comment.content,
        userId: comment.userId,
        userName: comment.userName,
        avatar: comment.avatar,
        time: comment.createdAt,
        id: comment._id.toString(),
        totalReply: comment.totalReply
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

   async createReply(createReplyDto : CreateReplyDto) {

    try {
      console.log(createReplyDto)
      const {userId, commentId, content} = createReplyDto;
      const newReply =
        {
        userId,
        commentId,
        content,
      }
      
      const result =  await this.ReplyCommentModel.create(newReply);
      const comment = await this.CommentModel.findById(commentId)
      if (comment && typeof comment.totalReply === 'number') {
        comment.totalReply++;
      }// tang so luong reply
      await comment?.save();
      return {statusCode : 201,message: 'Reply created successfully'};
    } catch (error) {
      console.error('Error creating reply:', error);
      throw new Error('Failed to create reply');
    }
   }
   // Lay danh sach reply theo commentId
   async getRepliesByCommentId(commentId: string, page = 1, limit = 5) {
    try {
      const skip = (page - 1) * limit;
  
      const replies = await this.ReplyCommentModel.aggregate([
        { $match: { commentId } },
        { $sort: { createdAt: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $addFields: {
            userIdObj: { $toObjectId: "$userId" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userIdObj",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $addFields: {
            userName: { $arrayElemAt: ["$user.name", 0] },
            avatar: { $arrayElemAt: ["$user.avatar", 0] }
          }
        },
        {
          $project: {
            user: 0,
            userIdObj: 0
          }
        }
      ]);
  
      const total = await this.ReplyCommentModel.countDocuments({ commentId });
  
      return {
        replies: replies.map(reply => ({
          content: reply.content,
          userId: reply.userId,
          userName: reply.userName,
          avatar: reply.avatar,
          time: reply.createdAt,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching replies by comment:', error);
      throw new Error('Failed to fetch replies for comment');
    }
  }
    // sua reply
  async updateReply(id: string, updateReplyDto: UpdateReplyDto) {
    try {
      const updatedReply = await this.ReplyCommentModel
        .findByIdAndUpdate(id, updateReplyDto, { new: true })
        .exec();
      if (!updatedReply) {
        throw new NotFoundException(`Reply with ID ${id} not found`);
      }
      return updatedReply;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating reply:', error);
      throw new Error('Failed to update reply');
    }}
   // xoa reply
  async removeReply(id: string) {
    try {
      const deletedReply = await this.ReplyCommentModel.findByIdAndDelete(id).exec();
      
      if (!deletedReply) {
        throw new NotFoundException(`Reply with ID ${id} not found`);
      }
      
      return { message: 'Reply deleted successfully', deletedReply };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting reply:', error);
      throw new Error('Failed to delete reply');
    }
  }
}
