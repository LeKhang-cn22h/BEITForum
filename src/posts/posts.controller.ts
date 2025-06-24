import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { VoteDto } from './dto/vote.dto';
import { Posts } from './schema/post.schema';
import { HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { get } from 'mongoose';
import { GetPostDto } from './dto/get-post.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('create')
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageUrls', maxCount: 10 },
      { name: 'videoUrls', maxCount: 10 },
    ]),
  ) // 'images' là tên field form-data
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    files: {
      imageUrls?: Express.Multer.File[];
      videoUrls?: Express.Multer.File[];
    },
  ) {
    console.log(createPostDto);
    return await this.postsService.createNewPost(createPostDto, files);
  }

  @Get('all')
  async getAllPost() {
    return await this.postsService.getAllPost();
  }

  @Get('id/:postId')
  async getPostById(@Param('postId') postId: string) {
    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('Post không tồn tại');

    return post;
  }

  @Post('vote/:postId')
  @HttpCode(200)
  async vote(@Param('postId') postId: string, @Body() voteDto: VoteDto) {
    console.log(voteDto);
    //return this.postsService.votes(postId, voteDto);
  }

  @Get('single/:postId')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('postId') postId: string) {
    if (!postId) {
      return {
        message: 'postId is required',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return this.postsService.getPostId(postId);
  }
  @Post('search')
  @HttpCode(200)
  async getPosts(@Body() getPostDto: GetPostDto) {
    return this.postsService.searchPosts(getPostDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }

  @Post('bookmarks/:postId/:userId')
  @HttpCode(HttpStatus.OK)
  async bookmarkPost(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    if (!postId || !userId) {
      return {
        message: 'postId và userId là bắt buộc',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return this.postsService.setBookmark(postId, userId);
  }
  @Get('bookmarks/:userId')
  @HttpCode(HttpStatus.OK)
  async getBookmarks(@Param('userId') userId: string) {
    if (!userId) {
      return {
        message: 'userId là bắt buộc',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return this.postsService.getBookmarks(userId);
  }
  @Patch('hide/:id')
  @HttpCode(HttpStatus.OK)
  hidePost(@Param('id') postId: string) {
    return this.postsService.hide(postId);
  }

}
