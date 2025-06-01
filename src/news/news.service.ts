import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './shcema/news.schema';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private NewsModel: Model<News>) {}
  async create(createNewsDto: CreateNewsDto) {
    try {
      const { userId, title, content, img } = createNewsDto;

      const newNews = new this.NewsModel({
        userId,
        title,
        content,
        img,
      });
      const savedNews = await newNews.save();

      return await savedNews;
    } catch (error) {
      console.error('Error creating new news:', error);
      throw new Error('Failed to create new news');
    }
  }

  async findAll() {
    try {
      const newss = await this.NewsModel.find().exec();
      return newss;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  }

  async findOne(id: string): Promise<News> {
    try {
      const post = await this.NewsModel.findById(id).exec();

      if (!post) {
        throw new NotFoundException(`News with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  async remove(id: string) {
    try {
      const deleted = await this.NewsModel.findByIdAndDelete(id).exec();

      if (!deleted) {
        throw new NotFoundException(`News with ID ${id} not found`);
      }

      return { message: 'News deleted successfully' };
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('Failed to delete news');
    }
  }
}
