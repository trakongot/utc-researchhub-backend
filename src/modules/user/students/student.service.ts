import { Injectable, Logger } from '@nestjs/common';
import prisma from 'src/components/prisma';
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
import { Student, studentSchema } from './schema';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  /** Lấy thông tin sinh viên theo ID */
  async get(id: string) {
    try {
      const student = await prisma.students.findUnique({ where: { id } });
      if (!student || student.isDeleted) {
        return notFoundResponse(`Không tìm thấy sinh viên với id: ${id}`);
      }
      return successResponse(student);
    } catch (error) {
      this.logger.error('Lỗi khi lấy thông tin sinh viên:', error);
      return errorResponse('Lỗi khi lấy thông tin sinh viên');
    }
  }

  /** Lấy danh sách sinh viên theo phân trang */
  async listStudents(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await prisma.$transaction([
        prisma.students.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
        }),
        prisma.students.count({
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
      this.logger.error('Lỗi khi lấy danh sách sinh viên:', error);
      return errorResponse('Lỗi khi lấy danh sách sinh viên');
    }
  }

  /** Tạo mới sinh viên với validate dữ liệu bằng zod */
  async create(dto: any) {
    const id = uuidv7();
    try {
      // Validate dữ liệu đầu vào, thêm các trường mặc định
      const parsedData: Student = studentSchema.parse({
        ...dto,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });
      const createdStudent = await prisma.students.create({
        data: parsedData,
      });
      return createdResponse(createdStudent);
    } catch (error) {
      this.logger.error('Lỗi khi tạo sinh viên:', error);
      return errorResponse('Lỗi khi tạo sinh viên');
    }
  }

  /** Cập nhật thông tin sinh viên */
  async update(id: string, dto: any) {
    try {
      const existing = await prisma.students.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) {
        return notFoundResponse(`Không tìm thấy sinh viên với id: ${id}`);
      }
      // Gộp dữ liệu mới với dữ liệu hiện có và cập nhật thời gian
      const updatedData = {
        ...dto,
        updatedAt: new Date(),
      };
      // Sử dụng schema.partial() để validate các trường được cập nhật
      const parsedData = studentSchema.partial().parse(updatedData);
      const updatedStudent = await prisma.students.update({
        where: { id },
        data: parsedData,
      });
      return successResponse(updatedStudent, 'Cập nhật thành công');
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật sinh viên với id ${id}:`, error);
      return errorResponse('Lỗi khi cập nhật sinh viên');
    }
  }

  /** Xóa mềm sinh viên */
  async delete(id: string) {
    try {
      const existing = await prisma.students.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) {
        return notFoundResponse(`Không tìm thấy sinh viên với id: ${id}`);
      }
      await prisma.students.update({
        where: { id },
        data: { isDeleted: true, updatedAt: new Date() },
      });
      return deletedResponse();
    } catch (error) {
      this.logger.error('Lỗi khi xóa sinh viên:', error);
      return errorResponse('Lỗi khi xóa sinh viên');
    }
  }
}
