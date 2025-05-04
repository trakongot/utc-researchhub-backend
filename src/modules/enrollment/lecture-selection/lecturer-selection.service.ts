import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FacultyRoleT, LecturerSelectionStatusT, Prisma } from '@prisma/client';
import { AuthPayload } from 'src/common/interface';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import {
  CreateLecturerSelectionDto,
  FindLecturerSelectionDto,
  UpdateLecturerSelectionDto,
  UpdateLecturerSelectionStatusDto,
} from './schema';

const LECTURER = FacultyRoleT.LECTURER;
const DEPARTMENT_HEAD = FacultyRoleT.DEPARTMENT_HEAD;
const DEAN = FacultyRoleT.DEAN;

@Injectable()
export class LecturerSelectionService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const selection = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      include: {
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            email: true,
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
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    return selection;
  }

  async find(dto: FindLecturerSelectionDto, user: AuthPayload) {
    const whereClause: Prisma.LecturerSelectionWhereInput = {};
    const userRoles = user.roles || [];

    const isDean = userRoles.includes(DEAN);
    const isTBM = userRoles.includes(DEPARTMENT_HEAD);
    const isLecturer = userRoles.includes(LECTURER);
    const isStudent = !isDean && !isTBM && !isLecturer;

    if (isStudent) {
      whereClause.isActive = true;
      whereClause.status = {
        in: [
          LecturerSelectionStatusT.APPROVED,
          LecturerSelectionStatusT.CONFIRMED,
        ],
      };
    } else if (isTBM && !isDean) {
      if (!user.departmentId) {
        console.error(
          `TBM user ${user.id} is missing departmentId in payload.`,
        );
        throw new ForbiddenException(
          'Không thể xác định bộ môn của trưởng bộ môn.',
        );
      }
      whereClause.Lecturer = { departmentId: user.departmentId };
    } else if (isLecturer && !isTBM && !isDean) {
      whereClause.OR = [
        {
          isActive: true,
          status: {
            in: [
              LecturerSelectionStatusT.APPROVED,
              LecturerSelectionStatusT.CONFIRMED,
            ],
          },
        },
        { lecturerId: user.id },
      ];
    }

    if (dto.lecturerIds?.length) {
      delete whereClause.OR;
      delete whereClause.Lecturer;
      whereClause.lecturerId = { in: dto.lecturerIds };
    } else if (dto.lecturerId) {
      delete whereClause.OR;
      delete whereClause.Lecturer;
      whereClause.lecturerId = dto.lecturerId;
    }

    if (dto.departmentId) {
      delete whereClause.OR;
      whereClause.Lecturer = { departmentId: dto.departmentId };
    }

    if (dto.fieldPoolId) whereClause.fieldPoolId = dto.fieldPoolId;
    if (dto.status) whereClause.status = dto.status;
    if (dto.isActive !== undefined) whereClause.isActive = dto.isActive;
    if (dto.keyword) {
      whereClause.topicTitle = {
        contains: dto.keyword,
        mode: 'insensitive' as const,
      };
    }

    const orderByField = dto.orderBy || 'createdAt';
    const orderDirection: Prisma.SortOrder = dto.asc === 'asc' ? 'asc' : 'desc';
    const orderBy: Prisma.LecturerSelectionOrderByWithRelationInput[] = [
      { [orderByField]: orderDirection },
    ];

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const selectFields: Prisma.LecturerSelectionSelect = {
      id: true,
      lecturerId: true,
      priority: true,
      topicTitle: true,
      description: !isStudent,
      createdAt: true,
      updatedAt: true,
      fieldPoolId: true,
      capacity: true,
      currentCapacity: true,
      status: true,
      isActive: true,
      Lecturer: {
        select: {
          id: true,
          fullName: true,
          departmentId: true,
        },
      },
      FieldPool: { select: { id: true, name: true } },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.lecturerSelection.findMany({
        where: whereClause,
        select: selectFields,
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.lecturerSelection.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  }

  async create(dto: CreateLecturerSelectionDto, requesterId: string) {
    const id = uuidv7();

    const existingTopic = await this.prisma.lecturerSelection.findFirst({
      where: { lecturerId: requesterId, topicTitle: dto.topicTitle },
    });
    if (existingTopic) {
      throw new BadRequestException(
        `Bạn đã đăng ký đề tài "${dto.topicTitle}" rồi`,
      );
    }

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

    return this.prisma.lecturerSelection.create({
      data: {
        id,
        lecturerId: requesterId,
        priority: dto.priority,
        topicTitle: dto.topicTitle,
        description: dto.description,
        capacity: dto.capacity,
        fieldPoolId: dto.fieldPoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        priority: true,
        topicTitle: true,
        status: true,
        isActive: true,
      },
    });
  }

  async updateByOwner(
    id: string,
    dto: UpdateLecturerSelectionDto,
    requesterId: string,
  ) {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      select: {
        status: true,
        topicTitle: true,
        lecturerId: true,
        fieldPoolId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    if (existing.lecturerId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa đăng ký đề tài này.',
      );
    }

    if (existing.status === LecturerSelectionStatusT.CONFIRMED) {
      throw new BadRequestException(
        'Không thể chỉnh sửa nội dung đề tài đã được xác nhận.',
      );
    }

    if (dto.topicTitle && dto.topicTitle !== existing.topicTitle) {
      const conflictingTopic = await this.prisma.lecturerSelection.findFirst({
        where: {
          lecturerId: existing.lecturerId,
          topicTitle: dto.topicTitle,
          id: { not: id },
        },
        select: { id: true },
      });
      if (conflictingTopic) {
        throw new BadRequestException(
          `Giảng viên này đã đăng ký đề tài "${dto.topicTitle}" rồi.`,
        );
      }
    }

    if (dto.fieldPoolId && dto.fieldPoolId !== existing.fieldPoolId) {
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

    return this.prisma.lecturerSelection.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
      select: {
        id: true,
        priority: true,
        topicTitle: true,
        description: true,
        capacity: true,
        status: true,
        isActive: true,
        fieldPoolId: true,
        updatedAt: true,
      },
    });
  }

  async updateStatusByAdmin(
    id: string,
    dto: UpdateLecturerSelectionStatusDto,
  ): Promise<any> {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      select: { id: true, status: true, lecturerId: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    const updatedSelection = await this.prisma.lecturerSelection.update({
      where: { id },
      data: {
        status: dto.status,
        updatedAt: new Date(),
      },
      select: { id: true, status: true, updatedAt: true, lecturerId: true },
    });

    return updatedSelection;
  }

  async updateStatusByOwner(
    id: string,
    dto: UpdateLecturerSelectionStatusDto,
    requesterId: string,
  ): Promise<any> {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      select: { id: true, status: true, lecturerId: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    if (existing.lecturerId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật trạng thái đề tài này.',
      );
    }

    const allowedTransitions: Partial<
      Record<LecturerSelectionStatusT, LecturerSelectionStatusT[]>
    > = {
      [LecturerSelectionStatusT.PENDING]: [
        LecturerSelectionStatusT.REQUESTED_CHANGES,
      ],
      [LecturerSelectionStatusT.REQUESTED_CHANGES]: [
        LecturerSelectionStatusT.PENDING,
      ],
    };

    if (!allowedTransitions[existing.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ ${existing.status} sang ${dto.status}.`,
      );
    }

    const updatedSelection = await this.prisma.lecturerSelection.update({
      where: { id },
      data: { status: dto.status, updatedAt: new Date() },
      select: { id: true, status: true, updatedAt: true },
    });

    return updatedSelection;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    if (
      existing.status === LecturerSelectionStatusT.APPROVED ||
      existing.status === LecturerSelectionStatusT.CONFIRMED
    ) {
      throw new BadRequestException(
        'Không thể xóa đề tài đã được duyệt hoặc xác nhận.',
      );
    }

    const studentSelectionCount = await this.prisma.studentSelection.count({
      where: { lecturerId: id },
    });

    if (studentSelectionCount > 0) {
      throw new BadRequestException(
        'Không thể xóa đề tài đã có sinh viên đăng ký.',
      );
    }

    await this.prisma.lecturerSelection.delete({ where: { id } });
  }

  // DeleteByOwner: Guard ensures DELETE_LECTURER_SELECTION permission. Service checks ownership again + business rules.
  async deleteByOwner(id: string, requesterId: string): Promise<void> {
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      select: { status: true, lecturerId: true }, // Need lecturerId for owner check
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    // Explicit Owner check
    if (existing.lecturerId !== requesterId) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa đăng ký đề tài này.',
      );
    }

    // Business Rule: Cannot delete if Approved or Confirmed
    if (
      existing.status === LecturerSelectionStatusT.APPROVED ||
      existing.status === LecturerSelectionStatusT.CONFIRMED
    ) {
      throw new BadRequestException(
        'Không thể xóa đề tài đã được duyệt hoặc xác nhận.',
      );
    }

    // Business Rule: Check if students are associated
    // ** VERIFY RELATIONSHIP: Assuming StudentSelection.lecturerId links to Faculty ID, NOT LecturerSelection ID **
    // If it links to LecturerSelection ID, use that directly: where: { lecturerSelectionId: id }
    // If it links to Faculty ID (more likely based on schema), use existing.lecturerId
    const studentSelectionCount = await this.prisma.studentSelection.count({
      where: { lecturerId: existing.lecturerId }, // Check selections linked to the FACULTY member
      // If the business rule is "students who picked THIS SPECIFIC TOPIC",
      // you might need a different check, maybe on ProjectAllocation or similar if StudentSelection stores topicTitle?
      // This check assumes we prevent deleting if the *lecturer* has *any* student selections. Refine if needed.
    });

    if (studentSelectionCount > 0) {
      // Consider if this rule should apply even if students selected a *different* topic from this lecturer
      throw new BadRequestException(
        'Không thể xóa đề tài của giảng viên đã có sinh viên đăng ký hướng dẫn.',
      );
    }

    await this.prisma.lecturerSelection.delete({ where: { id } });
  }

  // DeleteByAdmin: Guard ensures DELETE_ANY_LECTURER_SELECTION permission and scope (TBM/Dean).
  async deleteByAdmin(id: string): Promise<void> {
    // Check existence and status
    const existing = await this.prisma.lecturerSelection.findUnique({
      where: { id },
      // Select fields needed for checks
      select: { status: true, lecturerId: true }, // Need lecturerId for student check
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký đề tài với id: ${id}`,
      );
    }

    // Business Rule: Admin might have different rules, e.g., can they delete approved/confirmed?
    // Let's assume for now they face the same status restriction. Adjust if needed.
    if (
      existing.status === LecturerSelectionStatusT.APPROVED ||
      existing.status === LecturerSelectionStatusT.CONFIRMED
    ) {
      throw new BadRequestException(
        'Không thể xóa đề tài đã được duyệt hoặc xác nhận (Admin).',
      );
    }

    // Business Rule: Check associated students (same check as deleteByOwner, adjust logic if needed)
    // ** VERIFY RELATIONSHIP ** Assuming StudentSelection.lecturerId links to Faculty ID
    const studentSelectionCount = await this.prisma.studentSelection.count({
      where: { lecturerId: existing.lecturerId },
    });

    if (studentSelectionCount > 0) {
      // Maybe Admins *can* delete even if students selected? Adjust this rule if needed.
      throw new BadRequestException(
        'Không thể xóa đề tài của giảng viên đã có sinh viên đăng ký hướng dẫn (Admin).',
      );
    }

    // Perform deletion (Guard ensured permission and scope)
    await this.prisma.lecturerSelection.delete({ where: { id } });
  }
}
