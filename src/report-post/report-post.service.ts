  import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReportPostDto } from './dto/create-report-post.dto';
import { UpdateReportPostDto } from './dto/update-report-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReportPost } from './schema/report-post.schema';
import { Model, Types } from 'mongoose';
import { AiEvalService } from 'src/ai/ai-eval.service';
@Injectable()
export class ReportPostService {
  constructor(
    @InjectModel(ReportPost.name)
    private readonly reportPostModel: Model<ReportPost>,
    private readonly aiEvalService: AiEvalService, // Inject AI evaluation service
  ) {}

  async createReportPost(dto: CreateReportPostDto) {
    const report = new this.reportPostModel({
      reportedPostId: new Types.ObjectId(dto.reportedPostId),
      reporterUserId: new Types.ObjectId(dto.reporterUserId),
      reason: dto.reason,
    });
    return report.save();
  }

  async getAllReportPost() {
  const reports = await this.reportPostModel
    .find()
    .populate('reportedPostId', 'title userId') // populate post
    .populate('reporterUserId', 'name email')    // populate user
    .lean();

  return reports.map(report => {
  const post = report.reportedPostId as any;
  const reporter = report.reporterUserId as any;

  return {
    _id: report._id,
    reason: report.reason,
    createdAt: report.createdAt,
    reportedPostId: post?._id || '',
    reportedPostTitle: post?.title || '',
    reportedPostUserId: post?.userId || '',
   

  };
});

}


  async getReportPostById(id: string) {
  try {
    const report = await this.reportPostModel
      .findById(id)
      .populate({
        path: 'reportedPostId',
        select:
          'title content imageUrls videoUrls tags isPublished totalUpvotes totalDownvotes createdAt updatedAt userId',
      })
      .populate({
        path: 'reporterUserId',
        select: 'name email',
      })
      .exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const reportedPost = report.reportedPostId as any;
    const reporterUser = report.reporterUserId as any;

    // ✅ Gọi AI nếu chưa có kết quả
    if (!report.aiAnalysis && reportedPost?.title && reportedPost?.content) {
      const aiResult = await this.aiEvalService.evaluatePost(
        report.reason,
        reportedPost.title,
        reportedPost.content,
      );

      report.aiAnalysis = {
        violationPercentage: aiResult.violationPercentage,
        reason: aiResult.reason,
        shouldBan: aiResult.shouldBan,
      };

      await report.save();
    }

    const result = {
      _id: report._id,
      reason: report.reason,
      createdAt: report.createdAt,
      reportedPost: reportedPost,
      aiAnalysis: report.aiAnalysis
        ? {
            violationPercentage: report.aiAnalysis.violationPercentage,
            reason: report.aiAnalysis.reason,
            shouldBan: report.aiAnalysis.shouldBan,
          }
        : null,
      reporterUser: reporterUser
        ? {
            _id: reporterUser._id,
            name: reporterUser.name,
            email: reporterUser.email,
          }
        : null,
    };

    return result;
 } catch (err) {
  console.error('❌ getReportPostById error:', err);

  if (err instanceof NotFoundException) {
    throw err;
  }

  // Ghi log loại lỗi chi tiết hơn
  if (err instanceof Error) {
    throw new InternalServerErrorException(`Lỗi AI: ${err.message}`);
  }

  throw new InternalServerErrorException('Lỗi phân tích AI hoặc phản hồi không hợp lệ');
}

  
}


  async updateReportPost(id: string, dto: UpdateReportPostDto) {
    const updated = await this.reportPostModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Report not found to update');
    }

    return updated;
  }

  async deleteReportPost(id: string) {
    const deleted = await this.reportPostModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Report not found to delete');
    }

    return deleted;
  }
}
