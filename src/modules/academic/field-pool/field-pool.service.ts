import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { createFieldPoolDto, updateFieldPoolDto } from './dto';

@Injectable()
export class FieldPoolService {
  constructor(private prisma: PrismaService) {}

  // 🟢 FieldPool
  async create(dto: createFieldPoolDto) {
    const id = uuidv7();
    return this.prisma.fieldPool.create({
      data: {
        id,
        ...dto,
      },
    });
  }

  async get(id: string) {
    const fieldPool = await this.prisma.fieldPool.findUnique({ where: { id } });
    if (!fieldPool)
      throw new NotFoundException(`Không tìm thấy field pool với ID: ${id}`);
    return fieldPool;
  }

  async find() {
    return this.prisma.fieldPool.findMany({
      select: {
        name: true,
        description: true,
        id: true,
        FieldPoolDomain: {
          select: {
            Domain: {
              select: {
                name: true,
                description: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }
  async list() {
    return this.prisma.fieldPool.findMany({
      select: {
        name: true,
        description: true,
        id: true,
        FieldPoolDomain: {
          select: {
            Domain: {
              select: {
                name: true,
                description: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }
  async update(id: string, dto: updateFieldPoolDto) {
    return this.prisma.fieldPool.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    return this.prisma.fieldPool.delete({ where: { id } });
  }

  // 🔵 FieldPool - Department
  async addDept(fieldPoolId: string, departmentId: string) {
    return this.prisma.fieldPoolDepartment.create({
      data: { fieldPoolId, departmentId },
    });
  }

  async removeDept(fieldPoolId: string, departmentId: string) {
    return this.prisma.fieldPoolDepartment.delete({
      where: { fieldPoolId_departmentId: { fieldPoolId, departmentId } },
    });
  }

  async getDepts(fieldPoolId: string) {
    return this.prisma.fieldPoolDepartment.findMany({
      where: { fieldPoolId },
      include: { Department: true },
    });
  }

  // 🟠 FieldPool - Domain
  async addDomain(fieldPoolId: string, domainId: string) {
    return this.prisma.fieldPoolDomain.create({
      data: { fieldPoolId, domainId },
    });
  }

  async removeDomain(fieldPoolId: string, domainId: string) {
    return this.prisma.fieldPoolDomain.delete({
      where: { fieldPoolId_domainId: { fieldPoolId, domainId } },
    });
  }

  async getDomains(fieldPoolId: string) {
    return this.prisma.fieldPoolDomain.findMany({
      where: { fieldPoolId },
      include: { Domain: true },
    });
  }
}
