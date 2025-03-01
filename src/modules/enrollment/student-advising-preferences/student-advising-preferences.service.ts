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
import { CreateStudentAdvisingPreferencesDto } from './dto/create.dto';
import { FindStudentAdvisingPreferencesDto } from './dto/find.dto';
import { UpdateStudentAdvisingPreferencesDto } from './dto/update.dto';

@Injectable()
export class StudentAdvisingPreferencesService {
  private readonly logger = new Logger(StudentAdvisingPreferencesService.name);

  async get(id: string) {
    try {
      const studentAdvisingPreference =
        await prisma.studentAdvisingPreferences.findUnique({
          where: { id },
          include: {
            student: { select: { id: true, fullName: true } },
            facultyMember: { select: { id: true, fullName: true } },
            field: { select: { id: true, name: true } },
          },
        });
      if (!studentAdvisingPreference) {
        return notFoundResponse(
          `Không tìm thấy advising preference với id: ${id}`,
        );
      }
      return successResponse(studentAdvisingPreference);
    } catch (error) {
      this.logger.error('Lỗi khi lấy student advising preference:', error);
      return errorResponse('Lỗi khi lấy student advising preference');
    }
  }

  async searchByField(
    dto: FindStudentAdvisingPreferencesDto,
    page: number,
    limit: number,
  ) {
    try {
      const whereClause: Prisma.StudentAdvisingPreferencesWhereInput = {
        ...(dto.studentId ? { studentId: dto.studentId } : {}),
        ...(dto.facultyMemberId
          ? { facultyMemberId: dto.facultyMemberId }
          : {}),
        ...(dto.fieldId ? { fieldId: dto.fieldId } : {}),
        ...(dto.departmentId
          ? { student: { departmentId: dto.departmentId } }
          : {}),
        ...(dto.keyword && {
          student: { fullName: { contains: dto.keyword, mode: 'insensitive' } },
        }),
      };

      const orderByField = dto.orderBy || 'preferredAt';
      const orderDirection: Prisma.SortOrder =
        dto.asc === 'asc' ? 'asc' : 'desc';
      const orderBy: Prisma.StudentAdvisingPreferencesOrderByWithRelationInput[] =
        [{ [orderByField]: orderDirection }];

      const pagination: { skip: number; cursor?: { id: string } } = dto.lastId
        ? { cursor: { id: dto.lastId }, skip: 1 }
        : { skip: (page - 1) * limit };

      const [data, total] = await Promise.all([
        prisma.studentAdvisingPreferences.findMany({
          where: whereClause,
          select: {
            id: true,
            studentId: true,
            facultyMemberId: true,
            fieldId: true,
            preferredAt: true,
            createdAt: true,
            updatedAt: true,
            student: {
              select: {
                id: true,
                fullName: true,
                studentCode: true,
                departmentId: true,
              },
            },
            facultyMember: {
              select: {
                id: true,
                fullName: true,
                facultyCode: true,
                departmentId: true,
              },
            },
            field: { select: { id: true, name: true } },
          },
          take: limit,
          ...pagination,
          orderBy,
        }),
        prisma.studentAdvisingPreferences.count({ where: whereClause }),
      ]);

      const paginated: Paginated<(typeof data)[number]> = {
        data,
        paging: { page, limit },
        total,
      };

      const newLastId = data.length > 0 ? data[data.length - 1].id : null;

      return successPaginatedResponse(paginated, newLastId);
    } catch (error) {
      this.logger.error(
        'Lỗi khi tìm kiếm student advising preferences:',
        error,
      );
      return errorResponse('Lỗi khi tìm kiếm student advising preferences');
    }
  }

  async create(dto: CreateStudentAdvisingPreferencesDto) {
    const id = uuidv7();
    try {
      const newPreference = await prisma.studentAdvisingPreferences.create({
        data: {
          id,
          ...dto,
          preferredAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return createdResponse(newPreference);
    } catch (error) {
      this.logger.error('Lỗi khi tạo student advising preference:', error);
      return errorResponse('Lỗi khi tạo student advising preference');
    }
  }

  async update(id: string, dto: UpdateStudentAdvisingPreferencesDto) {
    try {
      const existingPreference =
        await prisma.studentAdvisingPreferences.findUnique({ where: { id } });
      if (!existingPreference) {
        return notFoundResponse(
          `Không tìm thấy advising preference với id: ${id}`,
        );
      }

      const updatedPreference = await prisma.studentAdvisingPreferences.update({
        where: { id },
        data: { ...dto, updatedAt: new Date() },
      });

      this.logger.log(`Đã cập nhật advising preference với id: ${id}`);
      return successResponse(updatedPreference, 'Cập nhật thành công');
    } catch (error) {
      this.logger.error(
        `Lỗi khi cập nhật advising preference với id ${id}:`,
        error,
      );
      return errorResponse('Lỗi khi cập nhật student advising preference');
    }
  }

  async delete(id: string) {
    try {
      const existingPreference =
        await prisma.studentAdvisingPreferences.findUnique({ where: { id } });
      if (!existingPreference) {
        return notFoundResponse(
          `Không tìm thấy advising preference với id: ${id}`,
        );
      }

      await prisma.studentAdvisingPreferences.delete({ where: { id } });
      this.logger.log(`Đã xóa advising preference với id: ${id}`);
      return deletedResponse();
    } catch (error) {
      this.logger.error('Lỗi khi xóa student advising preference:', error);
      return errorResponse('Lỗi khi xóa student advising preference');
    }
  }
}
