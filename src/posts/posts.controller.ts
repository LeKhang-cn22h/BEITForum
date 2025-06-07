import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { VoteDto } from './dto/vote.dto';
import { Posts } from './schema/post.schema';
import { HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { get } from 'mongoose';
import { GetPostDto } from './dto/get-post.dto';

@Controller('posts')

export class PostsController {
  constructor(private readonly postsService: PostsService) {}
 
  @Post('create')
  @HttpCode(201)
  async create(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    const res  = await this.postsService.createNewPost(createPostDto);
    return this.postsService.createNewPost(createPostDto);
  }

  @Post('vote/:postId')
  @HttpCode(200)
 async vote(
    @Param('postId') postId: string,
    @Body() voteDto: VoteDto,
  ) {
    console.log(voteDto);
    //return this.postsService.votes(postId, voteDto);
  }

  @Post("search")
  @HttpCode(200)
  async getPosts(@Body() getPostDto: GetPostDto) {
    return this.postsService.searchPosts(getPostDto)
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
  @Patch('hide/:id')
  @HttpCode(HttpStatus.OK)
  hidePost(@Param('id') postId: string) {
    return this.postsService.hide(postId);
  }
}
