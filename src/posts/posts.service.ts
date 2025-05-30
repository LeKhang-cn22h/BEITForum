import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './schema/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VoteDto } from './dto/vote.dto';
import { Types } from 'mongoose';
import { GetPostDto } from './dto/get-post.dto';
import { Vote } from 'src/vote/schema/vote.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private PostsModel: Model<Posts>,
    @InjectModel(Vote.name) private VoteModel: Model<Vote>,
  ) {}
  async createNewPost(createPostDto: CreatePostDto) {
    try {
      const { userId, title, content, imageUrl, tags, isPublished } = createPostDto;

      const newPost = new this.PostsModel({
      userId,
      title,
      content,
      imageUrl,
      tags,
      isPublished,
    });
    const savedPost = await newPost.save();
     // Initialize votes for the new post
     await this.initializeVotes(savedPost._id.toString());

    return await savedPost
   
    } catch (error) {
      console.error('Error creating new post:', error);
      throw new Error('Failed to create new post');
    }
    
  }

 
 private async  initializeVotes(postId: string) {
    try {
      const upvoteRecord = new this.VoteModel({
        postId,
        type: 'upvote',
        userId: [], 
        total: 0
      });

      const downvoteRecord = new this.VoteModel({
        postId,
        type: 'downvote',  
        userId: [], 
        total: 0
      });

      await Promise.all([
        upvoteRecord.save(),
        downvoteRecord.save()
      ]);

      console.log(`Initialized votes for post ${postId}`);
    } catch (error) {
      console.error('Error initializing votes:', error);
      throw new Error('Failed to initialize votes');
      
    }
 
  }
  async searchPosts(getPostDto: GetPostDto) {
    try {
      const { userId, title, tags, page = 5, limit = 5 } = getPostDto;
  
      const query: any = {};
  
      if (userId) {
        query.userId = userId;
      }
  
      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }
  
      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }
  
      const skip = (page - 1) * limit;
  
      const [posts, total] = await Promise.all([
        this.PostsModel.find(query)
          .populate('userId')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.PostsModel.countDocuments(query)
      ]);
  
      return {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }
  
  
  

  async updatePost(postId: string, updateData: Partial<CreatePostDto>) {
    try {
      const updatedPost = await this.PostsModel.findByIdAndUpdate(
        postId,
        updateData,
        { new: true }
      );
  
      if (!updatedPost) {
        throw new Error('Post not found');
      }
  
      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  }
  

  async deletePost(postId: string) {
    try {
      const deletedPost = await this.PostsModel.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        throw new Error('Post not found');
      }
  
      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post');
    }
  }
  
}
