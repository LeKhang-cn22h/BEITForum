import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint } from './shcema/complaint.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel(Complaint.name) private ComplaintModel: Model<Complaint>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createComplaintDto: CreateComplaintDto,
    file?: Express.Multer.File,
  ) {
    try {
      const createFields: Partial<CreateComplaintDto> = {};

      // Nếu có file avatar thì upload lên Cloudinary, rồi lấy URL lưu vào updateFields.avatar
      if (file) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createComplaintDto.userId,
            file,
          );
          createFields.img = uploadResult.secure_url;
          console.log('Avatar đã tải lên:', createFields.img);
        } catch (error) {
          console.error('Lỗi Cloudinary:', error);
          throw new BadRequestException('Lỗi khi tải avatar lên Cloudinary');
        }
      }

      const { userId, title, reason, img } = createComplaintDto;

      const newComplaint = new this.ComplaintModel({
        userId,
        title,
        reason,
        img: createFields.img || img,
      });

      const saveComplaint = await newComplaint.save();

      return { message: 'Tạo complaint thành công', saveComplaint };
    } catch (error) {
      console.error('Error creating new complaint:', error);
      throw new Error('Failed to create new complaint');
    }
    // return 'This action adds a new complaint';
  }

  async findAll() {
    try {
      const listComplaint = await this.ComplaintModel.find();
      return {
        message: 'BE-Đã lấy thành công tất cả khiếu nại',
        listComplaint,
      };
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw new Error('Failed to fetch complaint');
    }
  }

  async findOne(id: string): Promise<Complaint> {
    try {
      const complaint = await this.ComplaintModel.findById(id);

      if (!complaint) {
        throw new NotFoundException(`Complaint with ID ${id} not found`);
      }

      return complaint;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw new Error('Failed to fetch complaint');
    }
  }

  async findByField(field: string, value: any) {
    try {
      const allowedFields = ['userId', 'status', 'createdAt'];
      if (!allowedFields.includes(field)) {
        throw new Error('Invalid filter field');
      }
      const filter = { [field]: value };
      const listComplaint = await this.ComplaintModel.find(filter);
      return {
        message: `BE-Đã lấy thành công tất cả khiếu nại theo điều kiện ${field} = ${value}`,
        listComplaint,
      };
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw new Error('Failed to fetch complaint by field');
    }
  }

  async handleRejected(id: string) {
    try {
      const updatedComplaint = await this.ComplaintModel.findByIdAndUpdate(
        id,
        { status: 'rejected' },
        { new: true },
      );

      if (!updatedComplaint) {
        throw new Error('Complaint not found');
      }

      return { message: 'Đã xử lý thành công' };
    } catch (error) {
      console.error('Error rejecting complaint:', error);
      throw new Error('Failed to reject complaint');
    }
  }

  async handleApproved(id: string) {
    try {
      const updatedComplaint = await this.ComplaintModel.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true },
      );

      if (!updatedComplaint) {
        throw new Error('Complaint not found');
      }

      return { message: 'Đã xử lý thành công' };
    } catch (error) {
      console.error('Error approving complaint:', error);
      throw new Error('Failed to approve complaint');
    }
  }

  async remove(id: string) {
    try {
      const deletedComplaint = await this.ComplaintModel.findByIdAndDelete(id);

      if (!deletedComplaint) {
        throw new Error('Complaint not found');
      }

      return { success: true, message: 'Complaint deleted successfully' };
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw new Error('Failed to delete complaint');
    }
  }
}
