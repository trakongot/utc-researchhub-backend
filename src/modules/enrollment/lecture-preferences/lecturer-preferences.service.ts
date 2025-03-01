import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LecturerPreferences } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from 'src/components/prisma';
import { Paginated } from 'src/share';
import { uuidv7 } from 'uuidv7';
import { CreateLecturerPreferencesDto } from './dto';
import { FindLecturerPreferencesDto } from './dto/find-lecturer-preferences.dto';
import { UpdateLecturerPreferencesDto } from './dto/update-lecturer-preferences.dto';

@Injectable()
export class LecturerPreferencesService {
  private readonly logger = new Logger(LecturerPreferencesService.name);

  async get(id: string): Promise<{
    id: string;
    position: number;
    topicTitle: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    field: { id: string; name: string };
  } | null> {
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
          field: {
            select: { id: true, name: true },
          },
        },
      });
      return lecturerPreference;
    } catch (error) {
      console.error('Lỗi khi lấy lecturer preference:', error);
      throw new Error('Lỗi khi lấy lecturer preference');
    }
  }

  async listByLecturer(
    lecturerId: string,
    page: number,
    limit: number,
  ): Promise<
    Paginated<{
      id: string;
      position: number;
      topicTitle: string;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
      field: { id: string; name: string };
    }>
  > {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      prisma.lecturerPreferences.findMany({
        where: { lecturerId },
        select: {
          id: true,
          position: true,
          topicTitle: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          field: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
      }),
      prisma.lecturerPreferences.count({
        where: { lecturerId },
      }),
    ]);

    return {
      data,
      paging: { page, limit },
      total,
    };
  }

  async searchByField(
    dto: FindLecturerPreferencesDto,
    page: number,
    limit: number,
  ): Promise<
    Paginated<{
      id: string;
      position: number;
      topicTitle: string;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
      field: { id: string; name: string };
    }>
  > {
    const skip = (page - 1) * limit;
    const whereClause: any = {};
    if (dto.fieldId) whereClause.fieldId = dto.fieldId;
    if (dto.lecturerId) whereClause.lecturerId = dto.lecturerId;
    if (dto.keyword) {
      whereClause.topicTitle = {
        contains: dto.keyword,
        mode: 'insensitive',
      };
    }

    const [data, total] = await prisma.$transaction([
      prisma.lecturerPreferences.findMany({
        where: whereClause,
        select: {
          id: true,
          position: true,
          topicTitle: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          field: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
      }),
      prisma.lecturerPreferences.count({ where: whereClause }),
    ]);

    return {
      data,
      paging: { page, limit },
      total,
    };
  }

  async create(
    dto: CreateLecturerPreferencesDto,
    requesterId: string,
  ): Promise<string> {
    const id = uuidv7();

    const lecturer = await prisma.facultyMembers.findUnique({
      where: { id: requesterId },
    });

    if (!lecturer) {
      throw new BadRequestException(
        `Giảng viên với ID ${requesterId} không tồn tại.`,
      );
    }
    const existingTopic = await prisma.lecturerPreferences.findFirst({
      where: {
        lecturerId: requesterId,
        fieldId: dto.fieldId,
        NOT: { lecturerId: requesterId },
      },
    });

    if (existingTopic) {
      throw new BadRequestException(
        `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi. Không thể đăng ký lại!`,
      );
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.lecturerPreferences.create({
          data: {
            ...dto,
            lecturerId: requesterId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        this.logger.log(
          `Đã tạo preferences với id: ${id} bởi giảng viên: ${requesterId}`,
        );
      });

      return id;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          `Lỗi ràng buộc khóa ngoại: Giảng viên với ID ${requesterId} không tồn tại.`,
        );
      }
      throw error;
    }
  }

  async update(
    id: string,
    dto: UpdateLecturerPreferencesDto,
    requesterId: string,
  ): Promise<LecturerPreferences> {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.lecturerPreferences.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Không tìm thấy preferences với id: ${id}`);
      }
      if (existing.lecturerId !== requesterId) {
        throw new ForbiddenException(
          'Bạn không có quyền chỉnh sửa preferences này.',
        );
      }
      const lecturer = await tx.facultyMembers.findUnique({
        where: { id: requesterId },
      });

      if (!lecturer) {
        throw new BadRequestException(
          `Giảng viên với ID ${requesterId} không tồn tại.`,
        );
      }
      const existingTopic = await tx.lecturerPreferences.findFirst({
        where: {
          lecturerId: requesterId,
          topicTitle: dto.topicTitle,
        },
      });

      if (existingTopic) {
        throw new BadRequestException(
          `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi. Không thể đăng ký lại!`,
        );
      }
      const updated = await tx.lecturerPreferences.update({
        where: { id },
        data: { ...dto, updatedAt: new Date() },
      });

      this.logger.log(`Đã cập nhật preferences với id: ${id}`);
      return updated;
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.lecturerPreferences.findUnique({
        where: { id },
      });
      if (!existing)
        throw new Error(`Không tìm thấy preferences với id: ${id}`);

      await tx.lecturerPreferences.delete({ where: { id } });
      this.logger.log(`Đã xóa preferences với id: ${id}`);
    });
  }
}
