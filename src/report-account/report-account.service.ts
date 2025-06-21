import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportAccount } from './schema/report-account.schema';
import { Model, Types } from 'mongoose';
import { CreateReportAccountDto } from './dto/create-report-account.dto';
import { UpdateReportAccountDto } from './dto/update-report-account.dto';

@Injectable()
export class ReportAccountService {
  constructor(
    @InjectModel(ReportAccount.name)
    private reportModel: Model<ReportAccount>,
  ) {}

  
 async getReportedUsers(): Promise<ReportAccount[]> {

  return this.reportModel.find().exec();

 }



  async createReport(dto: CreateReportAccountDto) {
    const report = new this.reportModel({
      ...dto,
      reportedUserId: new Types.ObjectId(dto.reportedUserId),
      reporterUserId: new Types.ObjectId(dto.reporterUserId),
    });
    return report.save();
  }

  async getReportById(id: string) {
  try {
    const report = await this.reportModel
      .findById(id)
      .populate({
        path: 'reportedUserId',
        select: '_id name email phone isBanned'
      })
      .populate({
        path: 'reporterUserId',
        select: 'name'
      });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const reportedUser = report.reportedUserId as any;
    const reporterUser = report.reporterUserId as any;

    return {
  _id: report._id,
  reportedUser: {
    _id: reportedUser._id,
    name: reportedUser.name,
    email: reportedUser.email,
    phone: reportedUser.phone,
    isBanned: reportedUser.isBanned,
  },
  reporterName: reporterUser.name,
  reason: report.reason,
  createdAt: report.createdAt
};

  } catch (err) {
    console.error('getReportById error:', err);
    throw new NotFoundException('Invalid ID format or not found');
  }
}


  async updateReport(id: string, dto: UpdateReportAccountDto) {
    return this.reportModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteReport(id: string) {
    return this.reportModel.findByIdAndDelete(id);
  }
}
