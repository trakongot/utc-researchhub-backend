import { Injectable, Logger } from '@nestjs/common';
import prisma from 'src/components/prisma';
import { Lecturer } from './schema';
import { uuidv7 } from 'uuidv7';
import {
  createdResponse,
  deletedResponse,
  errorResponse,
  notFoundResponse,
  Paginated,
  successPaginatedResponse,
  successResponse,
} from 'src/share';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';

@Injectable()
export class LecturerService {
  private readonly logger = new Logger(LecturerService.name);

  /** Lấy thông tin giảng viên theo ID */
  async get(id: string) {
    try {
      const lecturer = await prisma.facultyMembers.findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          facultyCode: true,
          bio: true,
          email: true,
          status: true,
          profilePicture: true,
          departmentId: true,
          createdAt: true,
          updatedAt: true,
          isDeleted: true,
        },
      });
      if (!lecturer || lecturer.isDeleted) {
        return notFoundResponse(`Không tìm thấy giảng viên với id: ${id}`);
      }
      return successResponse(lecturer);
    } catch (error) {
      this.logger.error('Lỗi khi lấy thông tin giảng viên:', error);
      return errorResponse('Lỗi khi lấy thông tin giảng viên');
    }
  }

  /** Lấy danh sách giảng viên với phân trang */
  async listLecturers(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await prisma.$transaction([
        prisma.facultyMembers.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            email: true,
            status: true,
            profilePicture: true,
            departmentId: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.facultyMembers.count({
          where: { isDeleted: false },
        }),
      ]);

      const paginated: Paginated<(typeof data)[number]> = {
        data,
        paging: { page, limit },
        total,
      };

      return successPaginatedResponse(paginated, '1');
    } catch (error) {
      this.logger.error('Lỗi khi lấy danh sách giảng viên:', error);
      return errorResponse('Lỗi khi lấy danh sách giảng viên');
    }
  }

  /** Tạo mới giảng viên */
  async create(dto: CreateLecturerDto) {
    const id = uuidv7();
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Kiểm tra trùng email nếu cần
        const existing = await tx.facultyMembers.findUnique({
          where: { email: dto.email },
        });
        if (existing) {
          return errorResponse(`Email ${dto.email} đã tồn tại`, 400);
        }
        const newLecturer: Lecturer = {
          ...dto,
          id,
          status: 'ACTIVE',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: null,
          isOnline: false,
        } as Lecturer;
        const createdLecturer = await tx.facultyMembers.create({
          data: newLecturer,
        });
        return createdLecturer;
      });
      return createdResponse(result);
    } catch (error) {
      this.logger.error('Lỗi khi tạo giảng viên:', error);
      return errorResponse('Lỗi khi tạo giảng viên');
    }
  }

  /** Cập nhật thông tin giảng viên */
  async update(id: string, dto: UpdateLecturerDto) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const lecturer = await tx.facultyMembers.findUnique({ where: { id } });
        if (!lecturer || lecturer.isDeleted) {
          return notFoundResponse(`Không tìm thấy giảng viên với id: ${id}`);
        }
        // Nếu cập nhật email, kiểm tra trùng lặp
        if (dto.email && dto.email !== lecturer.email) {
          const existing = await tx.facultyMembers.findUnique({
            where: { email: dto.email },
          });
          if (existing) {
            return errorResponse(`Email ${dto.email} đã được sử dụng`, 400);
          }
        }
        const updatedLecturer = await tx.facultyMembers.update({
          where: { id },
          data: { ...dto, updatedAt: new Date() },
        });
        this.logger.log(`Đã cập nhật giảng viên với id: ${id}`);
        return successResponse(updatedLecturer, 'Cập nhật thành công');
      });
      return createdResponse(result);
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật giảng viên với id ${id}:`, error);
      return errorResponse('Lỗi khi cập nhật giảng viên');
    }
  }

  /** Xóa mềm giảng viên */
  async delete(id: string) {
    try {
      await prisma.$transaction(async (tx) => {
        const lecturer = await tx.facultyMembers.findUnique({ where: { id } });
        if (!lecturer || lecturer.isDeleted) {
          throw notFoundResponse(`Không tìm thấy giảng viên với id: ${id}`);
        }
        await tx.facultyMembers.update({
          where: { id },
          data: { isDeleted: true, updatedAt: new Date() },
        });
        this.logger.log(`Đã xóa mềm giảng viên với id: ${id}`);
      });
      return deletedResponse();
    } catch (error) {
      if ('message' in error && 'statusCode' in error) {
        return error;
      }
      this.logger.error('Lỗi khi xóa giảng viên:', error);
      return errorResponse('Lỗi khi xóa giảng viên');
    }
  }
}
