import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Paginated } from 'src/share';
import { uuidv7 } from 'uuidv7';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const department = await this.prisma.department.findUniqueOrThrow({
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

    return department;
  }

  async list(page: number, limit: number): Promise<Paginated<any>> {
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

    return { data, paging: { page, limit }, total };
  }

  async create(dto: CreateDepartmentDto) {
    const id = uuidv7();

    const existing = await this.prisma.department.findFirst({
      where: {
        OR: [{ departmentCode: dto.departmentCode }, { name: dto.name }],
      },
    });

    if (existing) {
      throw new ConflictException(`Mã hoặc tên khoa đã tồn tại`);
    }

    return this.prisma.department.create({
      data: {
        ...dto,
        id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findUniqueOrThrow({
      where: { id },
    });

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
        throw new ConflictException(`Mã hoặc tên khoa đã tồn tại`);
      }
    }

    return this.prisma.department.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async delete(id: string) {
    await this.prisma.department.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.department.delete({ where: { id } });
  }
}
