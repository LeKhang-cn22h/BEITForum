import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Skill, SkillDocument } from './schema/skill.shcema';
import { Model } from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}
  async scrapeTiobeAndSave(): Promise<string> {
    const url = 'https://www.tiobe.com/tiobe-index/';
    const response = await axios.get(url);
    const html = response.data;
    fs.writeFileSync('tiobe.html', html);
    const $ = cheerio.load(html);

    const skills: string[] = [];
    // 👉 Lấy ngôn ngữ từ bảng 1: VLTH
    $('table#VLTH tbody tr').each((_, element) => {
      const cols = $(element).find('td');
      const languageName = $(cols[0]).text().trim(); // Cột đầu tiên
      if (languageName) {
        skills.push(languageName);
      }
    });

    // 👉 Lấy ngôn ngữ từ bảng 2: otherPL
    $('table#otherPL tbody tr').each((_, element) => {
      const cols = $(element).find('td');
      const languageName = $(cols[1]).text().trim(); // Cột thứ 2 là tên ngôn ngữ
      if (languageName) {
        skills.push(languageName);
      }
    });

    // 👉 Loại bỏ trùng (nếu có)
    const uniqueSkills = Array.from(new Set(skills));

    // 👉 Lưu vào MongoDB (upsert tránh trùng)
    for (const name of uniqueSkills) {
      try {
        await this.skillModel.updateOne({ name }, { name }, { upsert: true });
      } catch (error) {
        console.error(`Lỗi lưu ${name}:`, error);
      }
    }

    return `Đã lưu ${uniqueSkills.length} ngôn ngữ từ TIOBE vào MongoDB`;
  }
  create(createSkillDto: CreateSkillDto) {
    return 'This action adds a new skill';
  }

  async findAll() {
    try {
      const listSkill = await this.skillModel.find();
      return { message: 'BE-Đã lấy thành công tất cả skill', listSkill };
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw new Error('Failed to fetch skills');
    }
  }

  async findOne(id: string): Promise<Skill> {
    try {
      const skill = await this.skillModel.findById(id);
      if (!skill) {
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return skill;
    } catch (error) {
      console.error('Error fetching skill:', error);
      throw new Error('Failed to fetch skill');
    }
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
