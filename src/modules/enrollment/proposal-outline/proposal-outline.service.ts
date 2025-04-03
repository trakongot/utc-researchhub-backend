import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserT } from '@prisma/client';
import { generateApiResponse } from 'src/common/responses';
import { PrismaService } from 'src/config/database';
import { uuidv7 } from 'uuidv7';
import {
  ApproveAllocationDto,
  AutoProposeDto,
  CreateProposalOutlineDto,
  FindProposalOutlineDto,
  UpdateProposalOutlineDto,
} from './proposal-outline.module.dto';

@Injectable()
export class ProposalOutlineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProposalOutlineDto) {
    const id = uuidv7();
    const result = await this.prisma.proposalOutline.create({
      data: {
        id,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return generateApiResponse('Tạo đề cương đề tài thành công', result);
  }

  async get(id: string) {
    const outline = await this.prisma.proposalOutline.findUnique({
      where: { id },
    });
    if (!outline) {
      throw new NotFoundException(`Không tìm thấy đề cương với id: ${id}`);
    }
    return generateApiResponse('Lấy đề cương đề tài thành công', outline);
  }

  async find(dto: FindProposalOutlineDto) {
    const whereClause: Prisma.ProposalOutlineWhereInput = {
      ...(dto.createdById && { createdById: dto.createdById }),
      ...(dto.creatorType && { creatorType: dto.creatorType as UserT }),
      ...(dto.status && { status: dto.status }),
    };

    const skip = (dto.page - 1) * dto.limit;
    const orderByField = dto.orderBy || 'createdAt';
    const orderDirection = dto.asc === 'asc' ? 'asc' : 'desc';
    const orderBy: Prisma.ProposalOutlineOrderByWithRelationInput[] = [
      { [orderByField]: orderDirection },
    ];

    const [data, total] = await Promise.all([
      this.prisma.proposalOutline.findMany({
        where: whereClause,
        select: {
          id: true,
          introduction: true,
          objectives: true,
          methodology: true,
          expectedResults: true,
          fileUrl: true,
          fileSize: true,
          status: true,
          createdById: true,
          creatorType: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: dto.limit,
        orderBy,
      }),
      this.prisma.proposalOutline.count({ where: whereClause }),
    ]);

    return generateApiResponse(
      'Lấy danh sách đề cương đề tài thành công',
      data,
      {
        page: dto.page,
        limit: dto.limit,
        total,
      },
    );
  }

  async update(id: string, dto: UpdateProposalOutlineDto) {
    const existingOutline = await this.prisma.proposalOutline.findUnique({
      where: { id },
    });
    if (!existingOutline) {
      throw new NotFoundException(`Không tìm thấy đề cương với id: ${id}`);
    }

    const result = await this.prisma.proposalOutline.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });

    return generateApiResponse('Cập nhật đề cương đề tài thành công', result);
  }

  async delete(id: string) {
    const existingOutline = await this.prisma.proposalOutline.findUnique({
      where: { id },
    });
    if (!existingOutline) {
      throw new NotFoundException(`Không tìm thấy đề cương với id: ${id}`);
    }

    await this.prisma.proposalOutline.delete({ where: { id } });

    return generateApiResponse('Xóa đề cương đề tài thành công', null);
  }

  async autoPropose(dto: AutoProposeDto, requesterId: string) {
    const currentYear = new Date().getFullYear();

    const [studentSelections, lecturerSelections] = await Promise.all([
      this.prisma.studentSelection.findMany({
        where: {
          status: 'APPROVED',
          ...(dto.departmentId && {
            Student: { departmentId: dto.departmentId },
          }),
          Student: { graduationYear: currentYear },
        },
        orderBy: [
          { priority: 'asc' }, // Ưu tiên theo priority trước
          { createdAt: 'asc' }, // Ai đăng ký sớm hơn được ưu tiên
        ],
        select: {
          id: true,
          studentId: true,
          lecturerId: true,
          topicTitle: true,
          priority: true,
          createdAt: true,
          Student: { select: { departmentId: true } }, // Lấy departmentId từ Student
        },
      }),
      this.prisma.lecturerSelection.findMany({
        where: {
          status: 'APPROVED',
          ...(dto.departmentId && {
            Lecturer: { departmentId: dto.departmentId }, // Sử dụng Lecturer thay vì Faculty
          }),
        },
        orderBy: { priority: 'asc' },
        select: {
          id: true,
          lecturerId: true,
          topicTitle: true,
          capacity: true,
          currentCapacity: true,
          Lecturer: { select: { departmentId: true } }, // Lấy departmentId từ Lecturer (Faculty)
        },
      }),
    ]);

    if (studentSelections.length === 0) {
      return generateApiResponse(
        'Không có học sinh nào trong khoa hoặc tốt nghiệp năm nay',
        {
          proposedProjects: [],
          allocations: [],
        },
      );
    }

    const lecturerMapById = new Map<
      string,
      (typeof lecturerSelections)[number]
    >(lecturerSelections.map((lecturer) => [lecturer.lecturerId, lecturer]));
    const lecturerMapByDepartment = new Map<
      string,
      (typeof lecturerSelections)[number][]
    >();
    lecturerSelections.forEach((lecturer) => {
      if (lecturer.Lecturer?.departmentId) {
        const existing =
          lecturerMapByDepartment.get(lecturer.Lecturer.departmentId) || [];
        existing.push(lecturer);
        lecturerMapByDepartment.set(lecturer.Lecturer.departmentId, existing);
      }
    });

    const usedStudents = new Set<string>();
    const usedLecturers = new Set<string>();
    const proposedProjects: any[] = [];
    const allocations: any[] = [];

    for (const studentSel of studentSelections) {
      if (usedStudents.has(studentSel.studentId)) continue;

      let matchedLecturer: (typeof lecturerSelections)[number] | undefined;

      // Ưu tiên 1: Ghép với giáo viên mong muốn
      if (studentSel.lecturerId) {
        const lecturer = lecturerMapById.get(studentSel.lecturerId);
        if (
          lecturer &&
          !usedLecturers.has(lecturer.lecturerId) &&
          lecturer.currentCapacity < lecturer.capacity
        ) {
          matchedLecturer = lecturer;
        }
      }

      // Ưu tiên 2: Ghép theo departmentId
      if (!matchedLecturer && studentSel.Student?.departmentId) {
        const departmentLecturers =
          lecturerMapByDepartment.get(studentSel.Student.departmentId) || [];
        matchedLecturer = departmentLecturers.find(
          (lecturer) =>
            !usedLecturers.has(lecturer.lecturerId) &&
            lecturer.currentCapacity < lecturer.capacity,
        );
      }

      // Ưu tiên 3: Ghép ngẫu nhiên
      if (!matchedLecturer) {
        matchedLecturer = lecturerSelections.find(
          (lecturer) =>
            !usedLecturers.has(lecturer.lecturerId) &&
            lecturer.currentCapacity < lecturer.capacity,
        );
      }

      if (matchedLecturer) {
        const projectId = uuidv7();
        const allocationId = uuidv7();
        const topicTitle =
          studentSel.topicTitle ||
          matchedLecturer.topicTitle ||
          'Đề tài tự động';

        const proposedProject = {
          id: projectId,
          title: topicTitle,
          description: `Đề xuất tự động cho sinh viên ${studentSel.studentId}`,
          status: 'PENDING_ADVISOR',
          createdById: studentSel.studentId,
          creatorType: 'STUDENT',
        };

        const allocation = {
          id: allocationId,
          topicTitle,
          studentId: studentSel.studentId,
          lecturerId: matchedLecturer.lecturerId,
          createdById: requesterId,
        };

        usedStudents.add(studentSel.studentId);
        usedLecturers.add(matchedLecturer.lecturerId);
        proposedProjects.push(proposedProject);
        allocations.push(allocation);
      }
    }

    return generateApiResponse('Tạo đề cương đề tài thành công', {
      proposedProjects,
      allocations,
    });
  }
  async confirmProposals(
    proposals: { proposedProjects: any[]; allocations: any[] },
    requesterId: string,
  ) {
    const isDean = await this.prisma.facultyRole.findFirst({
      where: { facultyId: requesterId, role: 'DEAN' },
    });
    if (!isDean) {
      throw new ForbiddenException(
        'Chỉ Trưởng khoa mới có quyền xác nhận phân công',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      for (const project of proposals.proposedProjects) {
        await tx.proposedProject.create({
          data: {
            ...project,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      for (const allocation of proposals.allocations) {
        await tx.projectAllocation.create({
          data: {
            ...allocation,
            allocatedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const lecturer = await tx.lecturerSelection.findUnique({
          where: { id: allocation.lecturerId },
        });
        if (lecturer && lecturer.currentCapacity < lecturer.capacity) {
          await tx.lecturerSelection.update({
            where: { id: lecturer.id },
            data: { currentCapacity: lecturer.currentCapacity + 1 },
          });
        }
      }
    });

    return generateApiResponse('Phân công đã được xác nhận', null);
  }
  async approveAllocation(dto: ApproveAllocationDto, requesterId: string) {
    const isDean = await this.prisma.facultyRole.findFirst({
      where: { facultyId: requesterId, role: 'DEAN' },
    });
    if (!isDean) {
      throw new ForbiddenException(
        'Chỉ Trưởng khoa mới có quyền duyệt phân công',
      );
    }

    const project = await this.prisma.proposedProject.findUnique({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException(
        `Không tìm thấy đề xuất đề tài với id: ${dto.projectId}`,
      );
    }

    if (
      !['ADVISOR_APPROVED', 'REQUESTED_CHANGES_HEAD'].includes(project.status)
    ) {
      throw new ForbiddenException(
        'Đề tài chưa được cố vấn phê duyệt hoặc không ở trạng thái chờ duyệt',
      );
    }

    const result = await this.prisma.proposedProject.update({
      where: { id: dto.projectId },
      data: {
        status: dto.status,
        approvedById: requesterId,
        approvedAt: dto.status === 'APPROVED_BY_HEAD' ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });

    return generateApiResponse('Duyệt đề tài thành công', result);
  }
}
