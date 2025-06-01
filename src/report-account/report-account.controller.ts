import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ReportAccountService } from './report-account.service';
import { CreateReportAccountDto } from './dto/create-report-account.dto';
import { UpdateReportAccountDto } from './dto/update-report-account.dto';

@Controller('report-account')
export class ReportAccountController {
  constructor(private readonly reportAccountService: ReportAccountService) {}

  @Get('reported-users')
  getReportUsers() {
    return this.reportAccountService.getReportedUsers();
  }

  @Post()
  createReport(@Body() createReportDto: CreateReportAccountDto) {
    return this.reportAccountService.createReport(createReportDto);
  }

  @Get(':id')
  getReportById(@Param('id') id: string) {
    return this.reportAccountService.getReportById(id);
  }

  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() dto: UpdateReportAccountDto) {
    return this.reportAccountService.updateReport(id, dto);
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string) {
    return this.reportAccountService.deleteReport(id);
  }
}
