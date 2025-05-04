import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FacultyRoleT,
  Prisma,
  StudentSelectionStatusT,
} from '@prisma/client';
import { AuthPayload } from 'src/common/interface';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import {
  CreateStudentSelectionDto,
  FindStudentSelectionDto,
  UpdateStudentSelectionDto,
  UpdateStudentSelectionStatusDto,
} from './schema';

const LECTURER = FacultyRoleT.LECTURER;
const DEPARTMENT_HEAD = FacultyRoleT.DEPARTMENT_HEAD;
const DEAN = FacultyRoleT.DEAN;

@Injectable()
export class StudentSelectionService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const selection = await this.prisma.studentSelection.findUnique({
      where: { id },
      include: {
        Student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            studentCode: true,
            departmentId: true,
          },
        },

        FieldPool: {
          select: {
            id: true,
            name: true,
            description: true,
            FieldPoolDomains: {
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

    if (!selection) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    return selection;
  }

  async find(dto: FindStudentSelectionDto, user: AuthPayload) {
    const whereClause: Prisma.StudentSelectionWhereInput = {};
    const userRoles = user.roles || [];

    const isDean = userRoles.includes(DEAN);
    const isTBM = userRoles.includes(DEPARTMENT_HEAD);
    const isLecturer = userRoles.includes(LECTURER);
    const isStudent = !isDean && !isTBM && !isLecturer;

    // Role-based filtering
    if (isStudent) {
      // Students can only see their own selections
      whereClause.studentId = user.id;
    } else if (isLecturer && !isTBM && !isDean) {
      // Lecturers see selections where they are selected
      whereClause.lecturerId = user.id;
    } else if (isTBM && !isDean) {
      // Department heads see selections in their department
      if (!user.departmentId) {
        console.error(
          `TBM user ${user.id} is missing departmentId in payload.`,
        );
        throw new ForbiddenException(
          'Không thể xác định bộ môn của trưởng bộ môn.',
        );
      }
      whereClause.Student = { departmentId: user.departmentId };
    }

    // Apply DTO filters
    if (dto.studentId) {
      whereClause.studentId = dto.studentId;
    }

    if (dto.lecturerId) {
      whereClause.lecturerId = dto.lecturerId;
    }

    if (dto.fieldPoolId) {
      whereClause.fieldPoolId = dto.fieldPoolId;
    }

    if (dto.status) {
      whereClause.status = dto.status;
    }

    if (dto.priority) {
      whereClause.priority = dto.priority;
    }

    if (dto.departmentId) {
      whereClause.Student = { departmentId: dto.departmentId };
    }

    if (dto.keyword) {
      whereClause.OR = [
        {
          Student: {
            fullName: { contains: dto.keyword, mode: 'insensitive' as const },
          },
        },
        {
          Student: {
            studentCode: {
              contains: dto.keyword,
              mode: 'insensitive' as const,
            },
          },
        },
        {
          topicTitle: { contains: dto.keyword, mode: 'insensitive' as const },
        },
      ];
    }

    const orderByField = dto.orderBy || 'priority';
    const orderDirection: Prisma.SortOrder = dto.asc === 'asc' ? 'asc' : 'desc';
    const orderBy: Prisma.StudentSelectionOrderByWithRelationInput[] = [
      { [orderByField]: orderDirection },
    ];

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const selectFields: Prisma.StudentSelectionSelect = {
      id: true,
      studentId: true,
      lecturerId: true,
      priority: true,
      topicTitle: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      fieldPoolId: true,
      preferredAt: true,
      ApprovedByFaculty: {
        select: {
          id: true,
          fullName: true,
          profilePicture: true,
        },
      },
      Student: {
        select: {
          id: true,
          fullName: true,
          studentCode: true,
          departmentId: true,
        },
      },

      FieldPool: { select: { id: true, name: true } },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.studentSelection.findMany({
        where: whereClause,
        select: selectFields,
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.studentSelection.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  }

  async create(dto: CreateStudentSelectionDto, requesterId: string) {
    const id = uuidv7();

    // Validate student exists
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
      select: { id: true },
    });

    if (!student) {
      throw new BadRequestException(
        `Không tìm thấy sinh viên với ID "${dto.studentId}".`,
      );
    }

    // Check if student is registering for the same priority
    const existingPriority = await this.prisma.studentSelection.findFirst({
      where: {
        studentId: dto.studentId,
        priority: dto.priority,
      },
    });

    if (existingPriority) {
      throw new BadRequestException(
        `Bạn đã đăng ký nguyện vọng với thứ tự ưu tiên ${dto.priority} rồi.`,
      );
    }

    // Validate lecturer exists if specified
    if (dto.lecturerId) {
      const lecturer = await this.prisma.faculty.findUnique({
        where: { id: dto.lecturerId },
        select: { id: true },
      });

      if (!lecturer) {
        throw new BadRequestException(
          `Không tìm thấy giảng viên với ID "${dto.lecturerId}".`,
        );
      }
    }

    // Validate field pool exists if specified
    if (dto.fieldPoolId) {
      const fieldPoolExists = await this.prisma.fieldPool.findUnique({
        where: { id: dto.fieldPoolId },
        select: { id: true },
      });
      if (!fieldPoolExists) {
        throw new BadRequestException(
          `Đợt đăng ký (Field Pool) với ID "${dto.fieldPoolId}" không tồn tại.`,
        );
      }
    }

    // Ensure either lecturer or field pool is specified
    if (!dto.lecturerId && !dto.fieldPoolId) {
      throw new BadRequestException(
        'Phải chọn ít nhất Giảng viên hướng dẫn hoặc Đợt đăng ký nguyện vọng.',
      );
    }

    return this.prisma.studentSelection.create({
      data: {
        id,
        studentId: dto.studentId,
        lecturerId: dto.lecturerId,
        priority: dto.priority,
        topicTitle: dto.topicTitle,
        description: dto.description,
        fieldPoolId: dto.fieldPoolId,
        preferredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        priority: true,
        topicTitle: true,
        status: true,
        studentId: true,
        lecturerId: true,
      },
    });
  }

  async updateByOwner(
    id: string,
    dto: UpdateStudentSelectionDto,
    requesterId: string,
  ) {
    const existing = await this.prisma.studentSelection.findUnique({
      where: { id },
      select: {
        status: true,
        topicTitle: true,
        studentId: true,
        lecturerId: true,
        priority: true,
        fieldPoolId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    if (existing.studentId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật nguyện vọng này.',
      );
    }

    // Using specific string literals for status check instead of enum for type safety
    const nonEditableStatuses = ['APPROVED', 'CONFIRMED', 'REJECTED'] as const;

    if (nonEditableStatuses.includes(existing.status as any)) {
      throw new BadRequestException(
        `Không thể cập nhật nguyện vọng với trạng thái "${existing.status}".`,
      );
    }

    // Check for conflict if priority is being updated
    if (dto.priority && dto.priority !== existing.priority) {
      const priorityConflict = await this.prisma.studentSelection.findFirst({
        where: {
          studentId: existing.studentId,
          priority: dto.priority,
          id: { not: id },
        },
      });

      if (priorityConflict) {
        throw new BadRequestException(
          `Bạn đã đăng ký nguyện vọng với thứ tự ưu tiên ${dto.priority} rồi.`,
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.topicTitle !== undefined) updateData.topicTitle = dto.topicTitle;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.lecturerId !== undefined) updateData.lecturerId = dto.lecturerId;
    if (dto.fieldPoolId !== undefined) updateData.fieldPoolId = dto.fieldPoolId;

    if (
      !updateData.lecturerId &&
      !updateData.fieldPoolId &&
      !existing.lecturerId &&
      !existing.fieldPoolId
    ) {
      throw new BadRequestException(
        'Phải chọn ít nhất Giảng viên hướng dẫn hoặc Đợt đăng ký nguyện vọng.',
      );
    }

    return this.prisma.studentSelection.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        priority: true,
        topicTitle: true,
        description: true,
        status: true,
        studentId: true,
        lecturerId: true,
        fieldPoolId: true,
        updatedAt: true,
      },
    });
  }

  async updateStatusByAdmin(
    id: string,
    dto: UpdateStudentSelectionStatusDto,
    approverId: string,
  ): Promise<any> {
    const existing = await this.prisma.studentSelection.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        studentId: true,
        lecturerId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    if (existing.status === dto.status) {
      return existing;
    }

    return this.prisma.studentSelection.update({
      where: { id },
      data: {
        status: dto.status,
        approvedByFacultyId: approverId,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatusByLecturer(
    id: string,
    dto: UpdateStudentSelectionStatusDto,
    requesterId: string,
  ): Promise<any> {
    const existing = await this.prisma.studentSelection.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        studentId: true,
        lecturerId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    if (existing.lecturerId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật trạng thái nguyện vọng này.',
      );
    }

    if (existing.status === dto.status) {
      return existing;
    }

    return this.prisma.studentSelection.update({
      where: { id },
      data: {
        status: dto.status,
        approvedByFacultyId: requesterId,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatusByOwner(
    id: string,
    dto: UpdateStudentSelectionStatusDto,
    requesterId: string,
  ): Promise<any> {
    const existing = await this.prisma.studentSelection.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        studentId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    if (existing.studentId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật trạng thái nguyện vọng này.',
      );
    }

    // Students can only confirm approved selections
    if (
      existing.status !== StudentSelectionStatusT.APPROVED &&
      dto.status === StudentSelectionStatusT.CONFIRMED
    ) {
      throw new BadRequestException(
        'Bạn chỉ có thể xác nhận nguyện vọng đã được phê duyệt.',
      );
    }

    if (existing.status === dto.status) {
      return existing;
    }

    return this.prisma.studentSelection.update({
      where: { id },
      data: {
        status: dto.status,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.studentSelection.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    await this.prisma.studentSelection.delete({ where: { id } });
  }

  async deleteByOwner(id: string, requesterId: string): Promise<void> {
    const existing = await this.prisma.studentSelection.findUnique({
      where: { id },
      select: { id: true, status: true, studentId: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký nguyện vọng với id: ${id}`,
      );
    }

    if (existing.studentId !== requesterId) {
      throw new ForbiddenException('Bạn không có quyền xóa nguyện vọng này.');
    }

    // Using specific string literals for status check instead of enum for type safety
    const nonDeletableStatuses = ['APPROVED', 'CONFIRMED'] as const;

    if (nonDeletableStatuses.includes(existing.status as any)) {
      throw new BadRequestException(
        `Không thể xóa nguyện vọng đã được phê duyệt hoặc xác nhận.`,
      );
    }

    await this.prisma.studentSelection.delete({ where: { id } });
  }

  async deleteByAdmin(id: string): Promise<void> {
    await this.delete(id);
  }
}
