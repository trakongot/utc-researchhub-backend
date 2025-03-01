import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/components/prisma'; // Prisma instance
import {
  createdResponse,
  errorResponse,
  Paginated,
  successPaginatedResponse,
  successResponse,
} from 'src/share';
import { CreateGraduationProjectAllocationsDto } from './dto/create.dto';
import { FindGraduationProjectAllocationsDto } from './dto/find.dto';
import { UpdateGraduationProjectAllocationsDto } from './dto/update.dto';

@Injectable()
export class GraduationProjectAllocationsService {
  private readonly logger = new Logger(
    GraduationProjectAllocationsService.name,
  );

  async create(dto: CreateGraduationProjectAllocationsDto) {
    try {
      const newAllocation = await prisma.graduationProjectAllocations.create({
        data: {
          ...dto,
          allocatedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return createdResponse(newAllocation);
    } catch (error) {
      this.logger.error('Error creating graduation project allocation', error);
      return errorResponse('Error creating graduation project allocation');
    }
  }

  async find(
    dto: FindGraduationProjectAllocationsDto,
    page: number,
    limit: number,
  ) {
    try {
      const whereClause: Prisma.GraduationProjectAllocationsWhereInput = {
        ...(dto.studentId ? { studentId: dto.studentId } : {}),
        ...(dto.lecturerId ? { lecturerId: dto.lecturerId } : {}),
        ...(dto.topicTitle
          ? { topicTitle: { contains: dto.topicTitle, mode: 'insensitive' } }
          : {}),
        ...(dto.departmentId
          ? { student: { departmentId: dto.departmentId } }
          : {}),
        ...(dto.allocatedAtStart &&
          dto.allocatedAtEnd && {
            allocatedAt: {
              gte: dto.allocatedAtStart,
              lte: dto.allocatedAtEnd,
            },
          }),
        ...(dto.createdAtStart &&
          dto.createdAtEnd && {
            createdAt: {
              gte: dto.createdAtStart,
              lte: dto.createdAtEnd,
            },
          }),
        ...(dto.updatedAtStart &&
          dto.updatedAtEnd && {
            updatedAt: {
              gte: dto.updatedAtStart,
              lte: dto.updatedAtEnd,
            },
          }),
      };

      const orderByField = dto.orderBy || 'allocatedAt';
      const orderDirection: Prisma.SortOrder =
        dto.asc === 'asc' ? 'asc' : 'desc';
      const orderBy: Prisma.GraduationProjectAllocationsOrderByWithRelationInput[] =
        [{ [orderByField]: orderDirection }];

      const pagination: { skip: number; cursor?: { id: string } } = dto.lastId
        ? { cursor: { id: dto.lastId }, skip: 1 }
        : { skip: (page - 1) * limit };

      const [data, total] = await Promise.all([
        prisma.graduationProjectAllocations.findMany({
          where: whereClause,
          select: {
            id: true,
            topicTitle: true,
            allocatedAt: true,
            createdAt: true,
            updatedAt: true,
            studentId: true,
            lecturerId: true,
          },
          take: limit,
          ...pagination,
          orderBy,
        }),
        prisma.graduationProjectAllocations.count({ where: whereClause }),
      ]);

      const paginated: Paginated<(typeof data)[number]> = {
        data,
        paging: { page, limit },
        total,
      };

      const newLastId = data.length > 0 ? data[data.length - 1].id : null;

      return successPaginatedResponse(paginated, newLastId);
    } catch (error) {
      this.logger.error('Error finding graduation project allocations', error);
      return errorResponse('Error finding graduation project allocations');
    }
  }

  async update(id: string, dto: UpdateGraduationProjectAllocationsDto) {
    try {
      const updated = await prisma.graduationProjectAllocations.update({
        where: { id },
        data: { ...dto, updatedAt: new Date() },
      });

      return successResponse(
        updated,
        'Successfully updated graduation project allocation',
      );
    } catch (error) {
      this.logger.error(
        `Error updating graduation project allocation with id: ${id}`,
        error,
      );
      return errorResponse('Error updating graduation project allocation');
    }
  }

  async delete(id: string) {
    try {
      await prisma.graduationProjectAllocations.delete({
        where: { id },
      });

      return successResponse(
        {},
        'Successfully deleted graduation project allocation',
      );
    } catch (error) {
      this.logger.error(
        `Error deleting graduation project allocation with id: ${id}`,
        error,
      );
      return errorResponse('Error deleting graduation project allocation');
    }
  }
}
