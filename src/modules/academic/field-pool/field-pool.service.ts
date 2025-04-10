import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { processDynamicFilters } from 'src/common/helper';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { ApiResponse, generateApiResponse } from 'src/common/response';
import { uuidv7 } from 'uuidv7';
import {
  createFieldPoolDto,
  FindFieldPoolDto,
  UpdateFieldPoolDto,
} from './schema';

@Injectable()
export class FieldPoolService {
  private readonly logger = new Logger(FieldPoolService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 🟢 FieldPool
  async create(dto: createFieldPoolDto) {
    const id = uuidv7();
    const fieldPool = await this.prisma.fieldPool.create({
      data: {
        id,
        ...dto,
      },
    });

    return generateApiResponse('Tạo field pool thành công', fieldPool);
  }

  async get(id: string) {
    const fieldPool = await this.prisma.fieldPool.findUnique({
      where: { id },
      include: {
        FieldPoolDomain: {
          include: {
            Domain: true,
          },
        },

        _count: {
          select: {
            LecturerSelection: true,
            StudentSelection: true,
            Project: true,
          },
        },
      },
    });
    if (!fieldPool) {
      throw new NotFoundException(`Không tìm thấy field pool với ID: ${id}`);
    }

    return generateApiResponse('Lấy field pool thành công', fieldPool);
  }

  async find(dto: FindFieldPoolDto): Promise<ApiResponse<any>> {
    const whereClause: Prisma.FieldPoolWhereInput = {
      FieldPoolDepartment:
        dto.departmentId || dto.department
          ? { some: { departmentId: dto.departmentId } }
          : undefined,
      name: dto.name ? { contains: dto.name, mode: 'insensitive' } : undefined,
      status: dto.status,
      OR: dto.search
        ? [
            { name: { contains: dto.search, mode: 'insensitive' } },
            { description: { contains: dto.search, mode: 'insensitive' } },
          ]
        : undefined,
      registrationDeadline:
        dto.startDate || dto.endDate
          ? {
              gte: dto.startDate,
              lte: dto.endDate,
            }
          : undefined,
      ...(dto.filters ? processDynamicFilters(dto.filters) : {}),
    };

    if (dto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: dto.departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Không tìm thấy field pool với departmentId: ${dto.departmentId}`,
        );
      }
    }

    const skip = ((dto.page || 1) - 1) * (dto.limit || 20);
    const orderBy = {
      [dto.orderBy || 'createdAt']: dto.asc === 'asc' ? 'asc' : 'desc',
    };

    const [data, total] = await Promise.all([
      this.prisma.fieldPool.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          registrationDeadline: true,
          createdAt: true,
          updatedAt: true,
          longDescription: true,
          FieldPoolDomain: {
            select: {
              Domain: { select: { name: true, description: true, id: true } },
            },
          },
          FieldPoolDepartment: {
            select: { Department: { select: { name: true, id: true } } },
          },
        },
        take: dto.limit,
        skip,
        orderBy: [orderBy],
      }),
      this.prisma.fieldPool.count({ where: whereClause }),
    ]);

    const pagination = {
      page: dto.page,
      limit: dto.limit,
      total,
      totalPages: Math.ceil(total / (dto.limit || 20)),
    };
    return generateApiResponse(
      total > 0
        ? 'Lấy danh sách field pool thành công'
        : 'Không tìm thấy field pool phù hợp',
      data,
      pagination,
    );
  }

  async list(): Promise<ApiResponse<any>> {
    const data = await this.prisma.fieldPool.findMany({
      select: {
        name: true,
        description: true,
        id: true,
        status: true,
        FieldPoolDomain: {
          select: {
            Domain: { select: { name: true, description: true, id: true } },
          },
        },
      },
    });

    return generateApiResponse('Lấy danh sách field pool thành công', data);
  }

  async update(id: string, dto: UpdateFieldPoolDto): Promise<ApiResponse<any>> {
    const fieldPool = await this.prisma.fieldPool.update({
      where: { id },
      data: dto,
    });

    return generateApiResponse('Cập nhật field pool thành công', fieldPool);
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    await this.prisma.fieldPool.delete({ where: { id } });

    return generateApiResponse('Xóa field pool thành công', null);
  }

  // 🔵 FieldPool - Department
  async addDept(
    fieldPoolId: string,
    departmentId: string,
  ): Promise<ApiResponse<any>> {
    const result = await this.prisma.fieldPoolDepartment.create({
      data: { fieldPoolId, departmentId },
    });

    return generateApiResponse('Thêm khoa vào field pool thành công', result);
  }

  async removeDept(
    fieldPoolId: string,
    departmentId: string,
  ): Promise<ApiResponse<any>> {
    await this.prisma.fieldPoolDepartment.delete({
      where: { fieldPoolId_departmentId: { fieldPoolId, departmentId } },
    });

    return generateApiResponse('Xóa khoa khỏi field pool thành công', null);
  }

  async getDepts(fieldPoolId: string): Promise<ApiResponse<any>> {
    const departments = await this.prisma.fieldPoolDepartment.findMany({
      where: { fieldPoolId },
      include: { Department: true },
    });

    return generateApiResponse(
      departments.length > 0
        ? 'Lấy danh sách khoa của field pool thành công'
        : 'Field pool không có khoa nào',
      departments,
    );
  }

  // 🟠 FieldPool - Domain
  async addDomain(
    fieldPoolId: string,
    domainId: string,
  ): Promise<ApiResponse<any>> {
    const result = await this.prisma.fieldPoolDomain.create({
      data: { fieldPoolId, domainId },
    });

    return generateApiResponse('Thêm domain vào field pool thành công', result);
  }

  async removeDomain(
    fieldPoolId: string,
    domainId: string,
  ): Promise<ApiResponse<any>> {
    await this.prisma.fieldPoolDomain.delete({
      where: { fieldPoolId_domainId: { fieldPoolId, domainId } },
    });

    return generateApiResponse('Xóa domain khỏi field pool thành công', null);
  }

  async getDomains(fieldPoolId: string): Promise<ApiResponse<any>> {
    const domains = await this.prisma.fieldPoolDomain.findMany({
      where: { fieldPoolId },
      include: { Domain: true },
    });

    return generateApiResponse(
      domains.length > 0
        ? 'Lấy danh sách domain của field pool thành công'
        : 'Field pool không có domain nào',
      domains,
    );
  }

  // 🟣 FieldPool - Lecturers
  async getLecturers(fieldPoolId: string): Promise<ApiResponse<any>> {
    // Verify the field pool exists
    const fieldPool = await this.prisma.fieldPool.findUnique({
      where: { id: fieldPoolId },
    });

    if (!fieldPool) {
      throw new NotFoundException(
        `Không tìm thấy field pool với ID: ${fieldPoolId}`,
      );
    }

    // Find all lecturers who have selections in this field pool
    const lecturers = await this.prisma.faculty.findMany({
      where: {
        LecturerSelection: {
          some: { fieldPoolId },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        departmentId: true,
        Department: {
          select: {
            id: true,
            name: true,
          },
        },
        LecturerSelection: {
          where: { fieldPoolId },
          select: {
            id: true,
            topicTitle: true,
            description: true,
            priority: true,
            capacity: true,
            currentCapacity: true,
            status: true,
          },
        },
      },
    });

    return generateApiResponse(
      lecturers.length > 0
        ? 'Lấy danh sách giảng viên của field pool thành công'
        : 'Field pool chưa có giảng viên nào',
      lecturers,
    );
  }
}
