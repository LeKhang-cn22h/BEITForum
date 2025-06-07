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
  Query,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('img'))
  async create(
    @Body() createComplaintDto: CreateComplaintDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createComplaintDto);
    return this.complaintService.create(createComplaintDto, file);
  }

  @Get('getall')
  async findAll() {
    return this.complaintService.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @Get('filter')
  async findByField(
    @Query('field') field: string,
    @Query('value') value: string,
  ) {
    return this.complaintService.findByField(field, value);
  }

  @Patch(':id/reject')
  async rejectComplaint(@Param('id') id: string) {
    return this.complaintService.handleRejected(id);
  }

  @Patch(':id/approve')
  async approveComplaint(@Param('id') id: string) {
    return this.complaintService.handleApproved(id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.complaintService.remove(id);
  }
}
