import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/components/prisma';
import {
  createdResponse,
  deletedResponse,
  errorResponse,
  notFoundResponse,
  Paginated,
  successPaginatedResponse,
  successResponse,
} from 'src/share';
import { uuidv7 } from 'uuidv7';
import { CreateFieldDto } from './dto/create.dto';
import { FindFieldDto } from './dto/find.dto';
import { UpdateFieldDto } from './dto/update.dto';

@Injectable()
export class FieldService {
  private readonly logger = new Logger(FieldService.name);

  async get(id: string) {
    try {
      const field = await prisma.field.findUnique({
        where: { id },
        include: { subFields: true },
      });
      if (!field) {
        return notFoundResponse(`Không tìm thấy lĩnh vực với id: ${id}`);
      }
      return successResponse(field);
    } catch (error) {
      this.logger.error('Lỗi khi lấy field:', error);
      return errorResponse('Lỗi khi lấy lĩnh vực');
    }
  }

  async searchByField(dto: FindFieldDto, page: number, limit: number) {
    try {
      const whereClause: Prisma.FieldWhereInput = {
        ...(dto.name
          ? { name: { contains: dto.name, mode: 'insensitive' as const } }
          : {}),
        ...(dto.parentId ? { parentId: dto.parentId } : {}),
      };

      const orderByField = dto.orderBy || 'name';
      const orderDirection: Prisma.SortOrder =
        dto.asc == 'asc' ? 'asc' : 'desc';
      const orderBy: Prisma.FieldOrderByWithRelationInput[] = [
        { [orderByField]: orderDirection },
      ];
      const pagination: { skip: number; cursor?: { id: string } } = dto.lastId
        ? { cursor: { id: dto.lastId }, skip: 1 }
        : { skip: (page - 1) * limit };

      const [data, total] = await Promise.all([
        prisma.field.findMany({
          where: whereClause,
          take: limit,
          ...pagination,
          orderBy,
        }),
        prisma.field.count({ where: whereClause }),
      ]);

      const paginated: Paginated<(typeof data)[number]> = {
        data,
        paging: {
          page,
          limit,
        },
        total,
      };

      const newLastId = data.length > 0 ? data[data.length - 1].id : null;

      return successPaginatedResponse(paginated, newLastId);
    } catch (error) {
      this.logger.error('Lỗi khi tìm kiếm fields:', error);
      return errorResponse('Lỗi khi tìm kiếm lĩnh vực');
    }
  }

  async create(dto: CreateFieldDto) {
    const id = uuidv7();
    try {
      const newField = await prisma.field.create({
        data: {
          id,
          name: dto.name,
          parentId: dto.parentId || null,
        },
      });
      return createdResponse(newField);
    } catch (error) {
      this.logger.error('Lỗi khi tạo field:', error);
      return errorResponse('Lỗi khi tạo lĩnh vực');
    }
  }

  async update(id: string, dto: UpdateFieldDto) {
    try {
      const existingField = await prisma.field.findUnique({ where: { id } });
      if (!existingField) {
        return notFoundResponse(`Không tìm thấy lĩnh vực với id: ${id}`);
      }

      const updatedField = await prisma.field.update({
        where: { id },
        data: {
          name: dto.name || existingField.name,
          parentId: dto.parentId || existingField.parentId,
        },
      });

      this.logger.log(`Đã cập nhật lĩnh vực với id: ${id}`);
      return successResponse(updatedField, 'Cập nhật thành công');
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật field với id ${id}:`, error);
      return errorResponse('Lỗi khi cập nhật lĩnh vực');
    }
  }

  async delete(id: string) {
    try {
      const existingField = await prisma.field.findUnique({ where: { id } });
      if (!existingField) {
        return notFoundResponse(`Không tìm thấy lĩnh vực với id: ${id}`);
      }

      await prisma.field.delete({ where: { id } });
      this.logger.log(`Đã xóa lĩnh vực với id: ${id}`);
      return deletedResponse();
    } catch (error) {
      this.logger.error('Lỗi khi xóa field:', error);
      return errorResponse('Lỗi khi xóa lĩnh vực');
    }
  }
}
