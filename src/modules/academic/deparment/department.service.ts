import { Injectable, Logger } from '@nestjs/common';
import prisma from 'src/components/prisma';
import { Department } from './schema';
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
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);

  /** Lấy thông tin khoa theo ID */
  async get(id: string) {
    try {
      const department = await prisma.academicDepartments.findUnique({
        where: { id },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          status: true,
          parentDepartmentId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!department) {
        return notFoundResponse(`Không tìm thấy khoa với id: ${id}`);
      }
      return successResponse(department);
    } catch (error) {
      this.logger.error('Lỗi khi lấy thông tin khoa:', error);
      return errorResponse('Lỗi khi lấy thông tin khoa');
    }
  }

  /** Lấy danh sách khoa với phân trang */
  async listDepartments(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await prisma.$transaction([
        prisma.academicDepartments.findMany({
          where: {},
          skip,
          take: limit,
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            status: true,
            parentDepartmentId: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.academicDepartments.count({ where: {} }),
      ]);

      const paginated: Paginated<(typeof data)[number]> = {
        data,
        paging: { page, limit },
        total,
      };

      return successPaginatedResponse(paginated, '1');
    } catch (error) {
      this.logger.error('Lỗi khi lấy danh sách khoa:', error);
      return errorResponse('Lỗi khi lấy danh sách khoa');
    }
  }

  /** Tạo mới khoa */
  async create(dto: CreateDepartmentDto) {
    const id = uuidv7();
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Kiểm tra trùng mã hoặc tên khoa nếu cần
        const existing = await tx.academicDepartments.findFirst({
          where: {
            OR: [{ code: dto.code }, { name: dto.name }],
          },
        });
        if (existing) {
          return errorResponse(`Mã hoặc tên khoa đã tồn tại`, 400);
        }
        const newDepartment: Department = {
          ...dto,
          id,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Department;
        const createdDepartment = await tx.academicDepartments.create({
          data: newDepartment,
        });
        return createdDepartment;
      });
      return createdResponse(result);
    } catch (error) {
      this.logger.error('Lỗi khi tạo khoa:', error);
      return errorResponse('Lỗi khi tạo khoa');
    }
  }

  /** Cập nhật thông tin khoa */
  async update(id: string, dto: UpdateDepartmentDto) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const department = await tx.academicDepartments.findUnique({
          where: { id },
        });
        if (!department) {
          return notFoundResponse(`Không tìm thấy khoa với id: ${id}`);
        }
        // Nếu cập nhật code hoặc name, kiểm tra trùng lặp
        if (
          (dto.code && dto.code !== department.code) ||
          (dto.name && dto.name !== department.name)
        ) {
          const existing = await tx.academicDepartments.findFirst({
            where: {
              OR: [
                dto.code ? { code: dto.code } : {},
                dto.name ? { name: dto.name } : {},
              ],
              NOT: { id },
            },
          });
          if (existing) {
            return errorResponse(`Mã hoặc tên khoa đã tồn tại`, 400);
          }
        }
        const updatedDepartment = await tx.academicDepartments.update({
          where: { id },
          data: { ...dto, updatedAt: new Date() },
        });
        this.logger.log(`Đã cập nhật khoa với id: ${id}`);
        return successResponse(updatedDepartment, 'Cập nhật thành công');
      });
      return createdResponse(result);
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật khoa với id ${id}:`, error);
      return errorResponse('Lỗi khi cập nhật khoa');
    }
  }

  /** Xóa (xóa mềm) khoa */
  async delete(id: string) {
    try {
      await prisma.$transaction(async (tx) => {
        const department = await tx.academicDepartments.findUnique({
          where: { id },
        });
        if (!department) {
          throw notFoundResponse(`Không tìm thấy khoa với id: ${id}`);
        }
        // Nếu cần, thay vì xóa cứng, có thể cập nhật trạng thái hoặc set một flag xóa mềm
        // Ở đây ta xóa cứng:
        await tx.academicDepartments.delete({ where: { id } });
        this.logger.log(`Đã xóa khoa với id: ${id}`);
      });
      return deletedResponse();
    } catch (error) {
      if ('message' in error && 'statusCode' in error) {
        return error;
      }
      this.logger.error('Lỗi khi xóa khoa:', error);
      return errorResponse('Lỗi khi xóa khoa');
    }
  }
}
