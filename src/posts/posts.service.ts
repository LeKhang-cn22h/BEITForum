import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './schema/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VoteDto } from './dto/vote.dto';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private PostsModel: Model<Posts>,
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
    // Save the new post to the database
    

    return await newPost.save();
    } catch (error) {
      console.error('Error creating new post:', error);
      throw new Error('Failed to create new post');
    }
    
  }

  async votes(postId: string, { userId, type }: VoteDto){
    try {
      const post = await this.PostsModel.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      const hasUpvoted = post.upvotes.includes(userId);
      // check xem da upvote chua
    
      const hasDownvoted = post.downvotes.includes(userId);
        // check xem da downvote chua
      if (type === 'upvote') {
        // Neu la upvote
        
        if (hasUpvoted) {
          // Neu da upvote roi thi xoa khoi danh sach upvotes
          post.upvotes = post.upvotes.filter(id => id !== userId);
        } else {
          // Neu chua upvote thi them vao danh sach upvotes
          post.upvotes.push(userId);
          if (hasDownvoted) {
            post.downvotes = post.downvotes.filter(id => id !== userId);
          }
        }
      } else if (type === 'downvote') {
        // Neu la downvote
        if (hasDownvoted) {
          // Neu da downvote roi thi xoa khoi danh sach downvotes
          post.downvotes = post.downvotes.filter(id => id !== userId);
        } else {
          // Neu chua downvote thi them vao danh sach downvotes
          post.downvotes.push(userId);
          if (hasUpvoted) {
            post.upvotes = post.upvotes.filter(id => id !== userId);
          }
        }
        
      } else {
        throw new Error('Invalid vote type');
      }
      post.save();
      return {
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
      };
      
    } catch (error) {
      console.error('Error processing votes:', error);
      throw new Error('Failed to process votes');
      
    }
  }
  async findById(userId?: string) {
    try {
      const posts = await this.PostsModel.find().populate('userId').exec();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
