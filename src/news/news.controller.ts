import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createNewsDto);
    return await this.newsService.create(createNewsDto, file);
  }

  @Get('getall')
  async findAll() {
    console.log('Đã lấy ra tất cả tin tức');
    return await this.newsService.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    console.log('Notification id: ', id);
    return await this.newsService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
