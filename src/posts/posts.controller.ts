import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { VoteDto } from './dto/vote.dto';
import { Posts } from './schema/post.schema';
import { HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

@Controller('posts')

export class PostsController {
  constructor(private readonly postsService: PostsService) {}
 
  @Post('create')
  @HttpCode(201)
  async create(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return this.postsService.createNewPost(createPostDto);
  }

  @Post('vote/:postId')
  @HttpCode(200)
 async vote(
    @Param('postId') postId: string,
    @Body() voteDto: VoteDto,
  ) {
    console.log(voteDto);
    return this.postsService.votes(postId, voteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
