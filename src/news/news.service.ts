import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './shcema/news.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private NewsModel: Model<News>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(createNewsDto: CreateNewsDto, file?: Express.Multer.File) {
    try {
      const createFields: Partial<CreateNewsDto> = {};

      // Nếu có file image complaint thì upload lên Cloudinary, rồi lấy URL lưu vào updateFields.avatar
      if (file) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createNewsDto.adminId,
            'imgNews',
            file,
          );
          createFields.img = uploadResult.secure_url;
          console.log('Avatar đã tải lên:', createFields.img);
        } catch (error) {
          console.error('Lỗi Cloudinary:', error);
          throw new BadRequestException('Lỗi khi tải avatar lên Cloudinary');
        }
      }

      const { adminId, title, content, img } = createNewsDto;

      const newNews = new this.NewsModel({
        adminId,
        title,
        content,
        img: createFields.img || img,
      });

      const saveNews = await newNews.save();

      return { message: 'Tạo tin tức thành công', saveNews };
    } catch (error) {
      console.error('Error creating new news:', error);
      throw new Error('Failed to create new news');
    }
  }

  async findAll() {
    try {
      const listNews = await this.NewsModel.find();
      return { message: 'BE-Đã lấy thành công tất cả tin tức', listNews };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  }

  async findOne(id: string): Promise<News> {
    try {
      const news = await this.NewsModel.findById(id);

      if (!news) {
        throw new NotFoundException(`News with ID ${id} not found`);
      }

      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  async remove(id: string) {
    try {
      const deleted = await this.NewsModel.findByIdAndDelete(id);

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
