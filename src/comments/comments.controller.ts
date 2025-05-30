import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }


  @Get('post/:postId')
  async findByPost(
    @Param('postId') postId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    return await this.commentsService.findByPost(postId, pageNum, limitNum);
  }
  

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.commentsService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsService.findOne(id); 
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.commentsService.update(id, updateCommentDto); 
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(id); 
  }
}