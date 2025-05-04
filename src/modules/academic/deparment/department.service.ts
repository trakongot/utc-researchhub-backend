import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { generateApiResponse } from 'src/common/response';
import { uuidv7 } from 'uuidv7';
import { CreateDepartmentDto, UpdateDepartmentDto } from './schema';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      select: {
        id: true,
        departmentCode: true,
        name: true,
        description: true,
        status: true,
        parentDepartmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy khoa với ID này.');
    }

    return department;
  }

  async list(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const data = await this.prisma.department.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        departmentCode: true,
        name: true,
        description: true,
        status: true,
        parentDepartmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const total = await this.prisma.department.count();
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPages,
    };
    return {
      data,
      pagination,
    };
  }

  async create(dto: CreateDepartmentDto) {
    const existing = await this.prisma.department.findFirst({
      where: {
        OR: [{ departmentCode: dto.departmentCode }, { name: dto.name }],
      },
    });

    if (existing) {
      throw new ConflictException('Mã hoặc tên khoa đã tồn tại');
    }

    const id = uuidv7();
    const department = await this.prisma.department.create({
      data: {
        ...dto,
        id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        departmentCode: true,
        name: true,
        description: true,
        status: true,
        parentDepartmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return generateApiResponse('Tạo khoa thành công', department);
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy khoa với ID này.');
    }

    if (dto.departmentCode || dto.name) {
      const existing = await this.prisma.department.findFirst({
        where: {
          OR: [
            dto.departmentCode ? { departmentCode: dto.departmentCode } : {},
            dto.name ? { name: dto.name } : {},
          ],
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Mã hoặc tên khoa đã tồn tại');
      }
    }

    const updatedDepartment = await this.prisma.department.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
      select: {
        id: true,
        departmentCode: true,
        name: true,
        description: true,
        status: true,
        parentDepartmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedDepartment;
  }

  async delete(id: string) {
    const department = await this.prisma.department.findFirst({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy khoa với ID này.');
    }

    await this.prisma.department.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
    });
    return null;
  }
}
