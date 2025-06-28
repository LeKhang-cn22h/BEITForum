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
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCommentDto: CreateCommentDto) {
    const res =  await this.commentsService.createComment(createCommentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment created successfully',
    };
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
  // EndPoint For Reply Comment
  @Post('reply')
  @HttpCode(HttpStatus.CREATED)
  async createReply(
    @Body() createReplyDto: CreateReplyDto
  ) {
    return await this.commentsService.createReply(createReplyDto);
  }
  @Get('reply/:commentId')
  async getRepliesByComment(
    @Param('commentId') commentId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10' ){
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    return await this.commentsService.getRepliesByCommentId(commentId, pageNum, limitNum);
    }
  @Patch('reply/:id')
  async updateReply(
    @Param('id') id: string, 
    @Body() updateReplyDto: CreateReplyDto
  ) {
    return await this.commentsService.updateReply(id, updateReplyDto);
  }
  @Delete('reply/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeReply(@Param('id') id: string) {
    await this.commentsService.removeReply(id);
  }
  @Get('admin/update-total-comments')
async triggerUpdateTotalComments() {
  return this.commentsService.updateAllUserTotalComments();
}

}