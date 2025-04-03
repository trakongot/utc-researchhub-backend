import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateApiResponse } from 'src/common/responses';
import { PrismaService } from 'src/config/database';
import {
  CreateProjectAllocationDto,
  FindProjectAllocationDto,
  UpdateProjectAllocationDto,
} from './project-allocation.dto';

@Injectable()
export class ProjectAllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectAllocationDto, requesterId: string) {
    const result = await this.prisma.projectAllocation.create({
      data: {
        ...dto,
        allocatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '1',
      },
    });

    return generateApiResponse('Tạo phân bổ đề tài thành công', result);
  }
  async get(id: string) {
    const projectAllocation = await this.prisma.projectAllocation.findUnique({
      where: { id },
      select: {
        id: true,
        topicTitle: true,
        allocatedAt: true,
        createdAt: true,
        updatedAt: true,
        studentId: true,
        lecturerId: true,
        createdById: true,
      },
    });

    if (!projectAllocation) {
      throw new NotFoundException(`Project allocation with ID ${id} not found`);
    }

    return projectAllocation;
  }
  async find(dto: FindProjectAllocationDto, page: number, limit: number) {
    const whereClause: Prisma.ProjectAllocationWhereInput = {
      studentId: dto.studentId ?? undefined,
      lecturerId: dto.lecturerId ?? undefined,
      topicTitle: dto.topicTitle
        ? { contains: dto.topicTitle, mode: 'insensitive' }
        : undefined,
      Student: dto.departmentId
        ? { departmentId: dto.departmentId }
        : undefined,
      allocatedAt:
        dto.allocatedAtStart && dto.allocatedAtEnd
          ? { gte: dto.allocatedAtStart, lte: dto.allocatedAtEnd }
          : undefined,
      createdAt:
        dto.createdAtStart && dto.createdAtEnd
          ? { gte: dto.createdAtStart, lte: dto.createdAtEnd }
          : undefined,
      updatedAt:
        dto.updatedAtStart && dto.updatedAtEnd
          ? { gte: dto.updatedAtStart, lte: dto.updatedAtEnd }
          : undefined,
    };

    const orderByField = dto.orderBy || 'allocatedAt';
    const orderDirection: Prisma.SortOrder = dto.asc === 'asc' ? 'asc' : 'desc';
    const orderBy = [{ [orderByField]: orderDirection }];
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.projectAllocation.findMany({
        where: whereClause,
        select: {
          id: true,
          topicTitle: true,
          allocatedAt: true,
          createdAt: true,
          updatedAt: true,
          studentId: true,
          lecturerId: true,
          createdById: true,
        },
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.projectAllocation.count({ where: whereClause }),
    ]);

    return generateApiResponse(
      'Lấy danh sách phân bổ đề tài thành công',
      data,
      {
        page,
        limit,
        total,
      },
    );
  }

  async update(id: string, dto: UpdateProjectAllocationDto) {
    const existing = await this.prisma.projectAllocation.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Không tìm thấy phân bổ với ID: ${id}`);

    const result = await this.prisma.projectAllocation.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });

    return generateApiResponse('Cập nhật phân bổ đề tài thành công', result);
  }

  async delete(id: string) {
    const existing = await this.prisma.projectAllocation.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Không tìm thấy phân bổ với ID: ${id}`);

    await this.prisma.projectAllocation.delete({ where: { id } });

    return generateApiResponse('Xóa phân bổ đề tài thành công', null);
  }
}
