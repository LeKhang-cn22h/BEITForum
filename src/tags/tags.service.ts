import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tags } from './schema/tags.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name) private readonly tagModel: Model<Tags>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<{ success: boolean; message: string; tag?: Tags }> {
    const existing = await this.tagModel.findOne({ name: createTagDto.name });
    if (!existing) {
      const newTag = new this.tagModel(createTagDto);
      const savedTag = await newTag.save();
      return {
        success: true,
        message: 'Tag created successfully',
      };
    }
    return {
      success: true,
      message: 'Tag already exists',
    };
  }

  async findAll(): Promise<Tags[]> {
    return this.tagModel.find().exec();
  }


  async search(query: string): Promise<Tags[]> {
    return this.tagModel.find({
      name: { $regex: query, $options: 'i' }, 
    }).exec();
  }
}
