import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/components/prisma';
import {
  createdResponse,
  deletedResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  Paginated,
  successPaginatedResponse,
  successResponse,
} from 'src/share';
import { uuidv7 } from 'uuidv7';
import { CreateLecturerPreferencesDto } from './dto';
import { FindLecturerPreferencesDto } from './dto/find-lecturer-preferences.dto';
import { UpdateLecturerPreferencesDto } from './dto/update-lecturer-preferences.dto';

@Injectable()
export class LecturerPreferencesService {
  private readonly logger = new Logger(LecturerPreferencesService.name);

  async get(id: string) {
    try {
      const lecturerPreference = await prisma.lecturerPreferences.findUnique({
        where: { id },
        select: {
          id: true,
          position: true,
          topicTitle: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          field: { select: { id: true, name: true } },
        },
      });
      if (!lecturerPreference) {
        return notFoundResponse(`Không tìm thấy preference với id: ${id}`);
      }
      return successResponse(lecturerPreference);
    } catch (error) {
      this.logger.error('Lỗi khi lấy lecturer preference:', error);
      return errorResponse('Lỗi khi lấy lecturer preference');
    }
  }

  async searchByField(
    dto: FindLecturerPreferencesDto,
    page: number,
    limit: number,
  ) {
    try {
      const whereClause: Prisma.LecturerPreferencesWhereInput = {
        ...(dto.lecturerIds?.length
          ? { lecturerId: { in: dto.lecturerIds } }
          : dto.lecturerId
            ? { lecturerId: dto.lecturerId }
            : {}),
        ...(dto.fieldIds?.length
          ? { fieldId: { in: dto.fieldIds } }
          : dto.fieldId
            ? { fieldId: dto.fieldId }
            : {}),
        ...(dto.keyword && {
          topicTitle: { contains: dto.keyword, mode: 'insensitive' as const },
        }),
      };

      const orderByField = dto.orderBy || 'createdAt';
      const orderDirection: Prisma.SortOrder =
        dto.asc == 'asc' ? 'asc' : 'desc';
      const orderBy: Prisma.LecturerPreferencesOrderByWithRelationInput[] = [
        { [orderByField]: orderDirection },
      ];
      const pagination: { skip: number; cursor?: { id: string } } = dto.lastId
        ? { cursor: { id: dto.lastId }, skip: 1 }
        : { skip: (page - 1) * limit };

      const [data, total] = await Promise.all([
        prisma.lecturerPreferences.findMany({
          where: whereClause,
          select: {
            id: true,
            lecturerId: true,
            position: true,
            topicTitle: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            field: {
              select: {
                id: true,
                name: true,
                parent: { select: { id: true, name: true } },
              },
            },
          },
          take: limit,
          ...pagination,
          orderBy,
        }),
        prisma.lecturerPreferences.count({ where: whereClause }),
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
      this.logger.error('Lỗi khi tìm kiếm lecturer preferences:', error);
      return errorResponse('Lỗi khi tìm kiếm lecturer preferences');
    }
  }

  async create(dto: CreateLecturerPreferencesDto, requesterId: string) {
    const id = uuidv7();
    try {
      const result = await prisma.$transaction(async (tx) => {
        const [lecturer, existingTopic] = await Promise.all([
          tx.facultyMembers.findUnique({ where: { id: requesterId } }),
          tx.lecturerPreferences.findFirst({
            where: { lecturerId: requesterId, topicTitle: dto.topicTitle },
          }),
        ]);

        if (!lecturer || existingTopic) {
          return errorResponse(
            !lecturer
              ? `Giảng viên với ID ${requesterId} không tồn tại`
              : `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi. Không thể đăng ký lại!`,
            400,
          );
        }

        const newPreference = await tx.lecturerPreferences.create({
          data: {
            id,
            ...dto,
            lecturerId: requesterId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return newPreference;
      });
      return createdResponse(result);
    } catch (error) {
      this.logger.error('Lỗi khi tạo lecturer preference:', error);
      return errorResponse('Lỗi khi tạo lecturer preference');
    }
  }

  async update(
    id: string,
    dto: UpdateLecturerPreferencesDto,
    requesterId: string,
  ) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const [existing, lecturer] = await Promise.all([
          tx.lecturerPreferences.findUnique({ where: { id } }),
          tx.facultyMembers.findUnique({ where: { id: requesterId } }),
        ]);

        if (!existing)
          return notFoundResponse(`Không tìm thấy preference với id: ${id}`);
        if (existing.lecturerId !== requesterId)
          return forbiddenResponse(
            'Bạn không có quyền chỉnh sửa preference này',
          );
        if (!lecturer)
          return errorResponse(
            `Giảng viên với ID ${requesterId} không tồn tại`,
            400,
          );

        if (dto.topicTitle && dto.topicTitle !== existing.topicTitle) {
          const existingTopic = await tx.lecturerPreferences.findFirst({
            where: { lecturerId: requesterId, topicTitle: dto.topicTitle },
          });

          if (existingTopic) {
            return errorResponse(
              `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi. Không thể đăng ký lại!`,
              400,
            );
          }
        }

        const updated = await tx.lecturerPreferences.update({
          where: { id },
          data: { ...dto, updatedAt: new Date() },
        });

        this.logger.log(`Đã cập nhật preference với id: ${id}`);
        return successResponse(updated, 'Cập nhật thành công');
      });
      return createdResponse(result);
    } catch (error) {
      this.logger.error(
        `Lỗi khi cập nhật lecturer preference với id ${id}:`,
        error,
      );
      return errorResponse('Lỗi khi cập nhật lecturer preference');
    }
  }

  async delete(id: string) {
    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.lecturerPreferences.findUnique({
          where: { id },
        });
        if (!existing) {
          throw notFoundResponse(`Không tìm thấy preference với id: ${id}`);
        }

        await tx.lecturerPreferences.delete({ where: { id } });
        this.logger.log(`Đã xóa preference với id: ${id}`);
      });
      return deletedResponse();
    } catch (error) {
      if ('message' in error && 'statusCode' in error) {
        return error;
      }
      this.logger.error('Lỗi khi xóa lecturer preference:', error);
      return errorResponse('Lỗi khi xóa lecturer preference');
    }
  }
}
