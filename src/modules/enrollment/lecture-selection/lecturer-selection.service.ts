import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Paginated } from 'src/share';
import { uuidv7 } from 'uuidv7';
import {
  CreateLecturerSelectionDto,
  FindLecturerSelectionDto,
  UpdateLecturerSelectionDto,
} from './dto';

@Injectable()
export class LecturerSelectionService {
  constructor(private readonly prisma: PrismaService) {}
  async get(id: string) {
    const lecturerPreference = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      select: {
        id: true,
        priority: true,
        topicTitle: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        FieldPool: {
          select: {
            name: true,
            description: true,
            FieldPoolDomain: {
              select: {
                Domain: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!lecturerPreference) {
      throw new NotFoundException(`Không tìm thấy preference với id: ${id}`);
    }
    return lecturerPreference;
  }

  async find(dto: FindLecturerSelectionDto, page: number, limit: number) {
    const whereClause: Prisma.LecturerSelectionWhereInput = {
      ...(dto.lecturerIds?.length
        ? { lecturerId: { in: dto.lecturerIds } }
        : dto.lecturerId
          ? { lecturerId: dto.lecturerId }
          : {}),
      ...(dto.studyFieldIds?.length
        ? { studyFieldId: { in: dto.studyFieldIds } }
        : dto.studyFieldId
          ? { fieldId: dto.studyFieldId }
          : {}),
      ...(dto.keyword && {
        topicTitle: { contains: dto.keyword, mode: 'insensitive' as const },
      }),
      ...(dto.departmentId
        ? { student: { departmentId: dto.departmentId } }
        : {}),
    };

    const orderByField = dto.orderBy || 'createdAt';
    const orderDirection: Prisma.SortOrder = dto.asc === 'asc' ? 'asc' : 'desc';
    const orderBy: Prisma.LecturerSelectionOrderByWithRelationInput[] = [
      { [orderByField]: orderDirection },
    ];
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.lecturerSelection.findMany({
        where: whereClause,
        select: {
          id: true,
          lecturerId: true,
          priority: true,
          topicTitle: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.lecturerSelection.count({ where: whereClause }),
    ]);

    return {
      data,
      paging: { page, limit },
      total,
    } as Paginated<(typeof data)[number]>;
  }

  async create(dto: CreateLecturerSelectionDto, requesterId: string) {
    const id = uuidv7();

    const lecturer = await this.prisma.faculty.findUnique({
      where: { id: requesterId },
    });
    if (!lecturer) {
      throw new NotFoundException(
        `Giảng viên với ID ${requesterId} không tồn tại`,
      );
    }

    const existingTopic = await this.prisma.lecturerSelection.findFirst({
      where: { lecturerId: requesterId, topicTitle: dto.topicTitle },
    });
    if (existingTopic) {
      throw new BadRequestException(
        `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi`,
      );
    }

    return this.prisma.lecturerSelection.create({
      data: {
        id,
        ...dto,
        lecturerId: requesterId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(
    id: string,
    dto: UpdateLecturerSelectionDto,
    requesterId: string,
  ) {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy preference với id: ${id}`);
    }

    if (existing.lecturerId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa preference này',
      );
    }

    const lecturer = await this.prisma.faculty.findUnique({
      where: { id: requesterId },
    });
    if (!lecturer) {
      throw new NotFoundException(
        `Giảng viên với ID ${requesterId} không tồn tại`,
      );
    }

    if (dto.topicTitle && dto.topicTitle !== existing.topicTitle) {
      const existingTopic = await this.prisma.lecturerSelection.findFirst({
        where: { lecturerId: requesterId, topicTitle: dto.topicTitle },
      });
      if (existingTopic) {
        throw new BadRequestException(
          `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi`,
        );
      }
    }

    return this.prisma.lecturerSelection.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy preference với id: ${id}`);
    }
    await this.prisma.lecturerSelection.delete({ where: { id } });
  }
}
