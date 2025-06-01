import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create')
  async create(@Body() createNewsDto: CreateNewsDto) {
    console.log(createNewsDto);
    return await this.newsService.create(createNewsDto);
  }

  @Get()
  async findAll() {
    console.log('Đã lấy ra tất cả tin tức');
    return await this.newsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('News id: ', id);
    return await this.newsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
