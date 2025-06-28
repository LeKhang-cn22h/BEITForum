import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './schema/post.schema';
import mongoose, { get, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VoteDto } from './dto/vote.dto';
import { Types } from 'mongoose';
import { GetPostDto } from './dto/get-post.dto';
import { Vote } from 'src/vote/schema/vote.schema';
import { User } from 'src/auth/schema/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BookMark } from './schema/bookmark.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private PostsModel: Model<Posts>,
    @InjectModel(Vote.name) private VoteModel: Model<Vote>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(BookMark.name) private BookMarkModel: Model<BookMark>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async createNewPost(
    createPostDto: CreatePostDto,
    files?: {
      imageUrls?: Express.Multer.File[];
      videoUrls?: Express.Multer.File[];
    },
  ) {
    try {
      const createFields: Partial<CreatePostDto> = {};

      // Nếu có file ảnh thì upload lên Cloudinary
      if (files?.imageUrls && files.imageUrls.length > 0) {
        try {
          const uploadResults = await Promise.all(
            files.imageUrls.map((file) =>
              this.cloudinaryService.uploadFile(
                createPostDto.userId,
                'post',
                file,
              ),
            ),
          );

          createFields.imageUrls = uploadResults.map(
            (result) => result.secure_url,
          );

          console.log('Các ảnh đã tải lên:', createFields.imageUrls);
        } catch (error) {
          console.error('Lỗi Cloudinary:', error);
          throw new BadRequestException('Lỗi khi tải ảnh lên Cloudinary');
        }
      }

      // Upload video lên Cloudinary
      if (files?.videoUrls && files.videoUrls.length > 0) {
        try {
          const uploadedVideos = await Promise.all(
            files.videoUrls.map((file) =>
              this.cloudinaryService.uploadFile(
                createPostDto.userId,
                'post',
                file,
              ),
            ),
          );
          createFields.videoUrls = uploadedVideos.map((res) => res.secure_url);
          console.log('Video đã upload:', createFields.videoUrls);
        } catch (err) {
          console.error('Lỗi khi upload video:', err);
          throw new BadRequestException('Không thể upload video');
        }
      }

      const {
        userId,
        title,
        content,
        imageUrls,
        videoUrls,
        tags,
        isPublished,
      } = createPostDto;

      const newPost = new this.PostsModel({
        userId,
        title,
        content,
        imageUrls: createFields.imageUrls || imageUrls,
        videoUrls: createFields.videoUrls || videoUrls,
        tags,
        isPublished,
      });

      const savedPost = await newPost.save();

      await this.initializeVotes(savedPost._id.toString());
      await this.UserModel.updateOne(
            { _id: userId },
            { $inc: { totalPost: 1 } }
          );


      return { message: 'Tạo post thành công', savedPost };
    } catch (error) {
      console.error('Error creating new post:', error);
      throw new Error('Failed to create new post');
    }
  }
// Lấy danh sách bài viết cho admin
  async getAllPost() {
    try {
      const listPost = await this.PostsModel.find();

      return { listPost };
    } catch (error) {
      console.error('Error getting list post:', error);
      throw new Error('Failed to get list post');
    }
  }

  private async initializeVotes(postId: string) {
    try {
      const upvoteRecord = new this.VoteModel({
        postId,
        type: 'upvote',
        userId: [],
        total: 0,
      });

      const downvoteRecord = new this.VoteModel({
        postId,
        type: 'downvote',
        userId: [],
        total: 0,
      });

      await Promise.all([upvoteRecord.save(), downvoteRecord.save()]);

      console.log(`Initialized votes for post ${postId}`);
    } catch (error) {
      console.error('Error initializing votes:', error);
      throw new Error('Failed to initialize votes');
    }
  }

  async getPosts(getPostDto: GetPostDto) {
    try {
      const { userId, title, tags, page = 1, limit = 5, postsId } = getPostDto;
  
       const query: any = {
        isHidden: false, // Chỉ lấy các bài viết không bị ẩn
      };
  
      if (userId) {
        query.userId = userId;
      }
  
      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }
  
      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }
  
      if (postsId && postsId.length > 0) {
        query._id = { $in: postsId.map(id => new Types.ObjectId(id)) };
      }
  
      const skip = (page - 1) * limit;
  
      // Use $facet to get both count and data in a single aggregation
      const result = await this.PostsModel.aggregate([
        { $match: query },
        {
          $facet: {
            // Get the total count
            totalCount: [
              { $count: "count" }
            ],
            // Get the paginated data
            data: [
              { $sort: { createdAt: -1, _id: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $addFields: {
                  userIdObj: { $toObjectId: '$userId' },
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'userIdObj',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $addFields: {
                  userName: { $arrayElemAt: ['$user.name', 0] },
                  avatar: { $arrayElemAt: ['$user.avatar', 0] },
                },
              },
              { $project: { user: 0, userIdObj: 0 } },
            ]
          }
        }
      ]);
  
      // Extract results
      const posts = result[0]?.data || [];
      const total = result[0]?.totalCount[0]?.count || 0;
      console.log('Total posts found:', total);
  
      return {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }
// Lấy thông tin chi tiết của một bài viết theo ID
  async getPostId(postId: string) {
    try {
      const post = await this.PostsModel.aggregate([
        { $match: { _id: new Types.ObjectId(postId) } }, 
        {
          $addFields: {
            userIdObj: { $toObjectId: '$userId' }, 
          },
        },
        {
          $lookup: {
            from: 'users', 
            localField: 'userIdObj',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $addFields: {
            userName: { $arrayElemAt: ['$user.name', 0] }, 
            avatar: { $arrayElemAt: ['$user.avatar', 0] }, 
          },
        },
        { $project: { user: 0, userIdObj: 0 } }, 
      ]);
  
      if (!post || post.length === 0) {
        throw new Error('Post not found');
      }
  
      return {
        post: post[0], // Return the first matched post
        message: 'Post retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw new Error('Failed to get post by ID');
    }
  }
  async updatePost(postId: string, updateData: Partial<CreatePostDto>) {
    try {
      const updatedPost = await this.PostsModel.findByIdAndUpdate(
        postId,
        updateData,
        { new: true },
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
      await this.VoteModel.deleteMany({ postId });

      await this.BookMarkModel.updateMany(
        { postId: { $in: [postId] } }, 
        { $pull: { postId } }
      );
  
      return {
        success: true,
        message: 'Post deleted successfully',
        deletedPostId: postId,
      };
    } catch (error) {
      console.error('Error deleting post:', error.message || error);
      throw new Error('Failed to delete post');
    }
  }
  
  async hide(postId: string) {
    try {
      const post = await this.PostsModel.findByIdAndUpdate(
        postId,
        { isHidden: true },
        { new: true },
      );

      if (!post) {
        throw new Error('Post not found');
      }

      return { success: true, message: 'Post hidden successfully', post };
    } catch (error) {
      console.error('Error hiding post:', error);
      throw new Error('Failed to hide post');
    }
  }
  // them bookmark cho post
  async setBookmark(postId: string, userId: string) {
    try {
      const bookmark = await this.BookMarkModel.findOne({ userId });
      console.log('Bookmark record:', bookmark);

      if (!bookmark) {
        // Nếu user chưa có bookmark record, tạo mới
        await this.BookMarkModel.create({
          userId: userId,
          postId: [postId],
        });
        return { message: 'Added to bookmarks' };
      }

      const postIndex = bookmark.postId.findIndex((id) => id === postId);
      console.log('Post index in bookmark:', postIndex);

      if (postIndex > -1) {
        // Nếu đã bookmark → xóa postId khỏi mảng
        bookmark.postId.splice(postIndex, 1);
        await bookmark.save();
        return { message: 'Removed from bookmarks', isBookmarked: false };
      } else {
        // Nếu chưa bookmark → thêm vào mảng
        bookmark.postId.push(postId);
        await bookmark.save();
        return { message: 'Added to bookmarks', isBookmarked: true };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update bookmarks');
    }
  }
  // lay danh sach bookmark cua user
  async getBookmarks(userId: string) {
    try {
      const bookmark = await this.BookMarkModel.findOne({ userId });

      return {
        postsId: bookmark ? bookmark.postId : [],
        message: bookmark
          ? 'Bookmarks retrieved successfully'
          : 'No bookmarks found',
      };
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      throw new Error('Failed to get bookmarks');
    }
  }

// // ⚠️ CHẠY 1 LẦN để cập nhật dữ liệu cũ
// async updateAllUserTotalPosts() {
//   try {
//     // Bước 1: Lấy toàn bộ bài viết
//     const allPosts = await this.PostsModel.find({}, { userId: 1 });

//     // Bước 2: Gom nhóm số bài theo từng user
//     const userPostCountMap: Record<string, number> = {};

//     for (const post of allPosts) {
//       const userIdStr = String(post.userId); // ép sang chuỗi để đồng bộ
//       if (userPostCountMap[userIdStr]) {
//         userPostCountMap[userIdStr]++;
//       } else {
//         userPostCountMap[userIdStr] = 1;
//       }
//     }

//     // Bước 3: Cập nhật vào bảng User
//     const updateResults: string[] = [];


//     for (const [userId, count] of Object.entries(userPostCountMap)) {
//       const result = await this.UserModel.updateOne(
//         { _id: userId },
//         { $set: { totalPost: count } }
//       );
//       updateResults.push(`✅ User ${userId} có ${count} bài viết`);
//     }

//     return {
//       message: 'Đã cập nhật totalPost dựa trên từng bài viết',
//       updates: updateResults,
//     };
//   } catch (error) {
//     console.error('❌ Lỗi khi cập nhật totalPost:', error);
//     throw new Error('Failed to update totalPost');
//   }
// }


}
