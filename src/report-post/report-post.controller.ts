import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportPostService } from './report-post.service';
import { CreateReportPostDto } from './dto/create-report-post.dto';
import { UpdateReportPostDto } from './dto/update-report-post.dto';

@Controller('report-post')
export class ReportPostController {
  constructor(private readonly reportPostService: ReportPostService) {}

  @Post()
  async createReportPost(@Body() dto: CreateReportPostDto) {
    return this.reportPostService.createReportPost(dto);
  }

  @Get()
  async getAllReportsPost() {
    return this.reportPostService.getAllReportPost();
  }

  @Get(':id')
  async getReportPostById(@Param('id') id: string) {
    return this.reportPostService.getReportPostById(id);
  }

  @Patch(':id')
  async updateReportPost(@Param('id') id: string, @Body() dto: UpdateReportPostDto) {
    return this.reportPostService.updateReportPost(id, dto);
  }

  @Delete(':id')
  async deleteReportPost(@Param('id') id: string) {
    return this.reportPostService.deleteReportPost(id);
  }
}
