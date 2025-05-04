import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FacultyRoleT, Prisma, StudentSelectionStatusT } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { AuthPayload } from 'src/common/interface';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import {
  CreateProjectAllocationDto,
  FindProjectAllocationDto,
  RecommendationExportDto,
  UpdateProjectAllocationDto,
} from './schema';

const LECTURER = FacultyRoleT.LECTURER;
const DEPARTMENT_HEAD = FacultyRoleT.DEPARTMENT_HEAD;
const DEAN = FacultyRoleT.DEAN;

const MEMBER_ROLES = {
  ADVISOR: 'ADVISOR',
  STUDENT: 'STUDENT',
  MEMBER: 'MEMBER',
  LEADER: 'LEADER',
};

@Injectable()
export class ProjectAllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectAllocationDto, requesterId: string) {
    const id = uuidv7();

    return this.prisma.projectAllocation.create({
      data: {
        id,
        topicTitle: dto.topicTitle,
        studentId: dto.studentId,
        lecturerId: dto.lecturerId,
        createdById: requesterId,
        allocatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        Student: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
            departmentId: true,
          },
        },
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            departmentId: true,
          },
        },
      },
    });
  }

  async find(dto: FindProjectAllocationDto, user: AuthPayload) {
    const whereClause: Prisma.ProjectAllocationWhereInput = {};
    const userRoles = user.roles || [];

    const isDean = userRoles.includes(DEAN);
    const isTBM = userRoles.includes(DEPARTMENT_HEAD);
    const isLecturer = userRoles.includes(LECTURER);
    const isStudent = !isDean && !isTBM && !isLecturer;

    // Role-based filtering
    if (isStudent) {
      whereClause.studentId = user.id;
    } else if (isLecturer && !isTBM && !isDean) {
      whereClause.lecturerId = user.id;
    } else if (isTBM && !isDean) {
      if (!user.departmentId) {
        console.error(
          `TBM user ${user.id} is missing departmentId in payload.`,
        );
        throw new ForbiddenException(
          'Không thể xác định bộ môn của trưởng bộ môn.',
        );
      }
      whereClause.OR = [
        { Student: { departmentId: user.departmentId } },
        { Lecturer: { departmentId: user.departmentId } },
      ];
    }

    // Dean sees all initially

    // Apply DTO filters
    if (dto.studentId) {
      whereClause.studentId = dto.studentId;
    }
    if (dto.lecturerId) {
      whereClause.lecturerId = dto.lecturerId;
    }
    if (dto.departmentId) {
      // Override previous OR if department filter is specifically applied
      whereClause.OR = [
        { Student: { departmentId: dto.departmentId } },
        { Lecturer: { departmentId: dto.departmentId } },
      ];
    }

    if (dto.keyword) {
      const keywordLower = dto.keyword.toLowerCase(); // Normalize keyword
      const keywordFilter: Prisma.ProjectAllocationWhereInput = {
        OR: [
          { topicTitle: { contains: keywordLower, mode: 'insensitive' } },
          {
            Student: {
              fullName: { contains: keywordLower, mode: 'insensitive' },
            },
          },
          {
            Student: {
              studentCode: { contains: keywordLower, mode: 'insensitive' },
            },
          },
          {
            Lecturer: {
              fullName: { contains: keywordLower, mode: 'insensitive' },
            },
          },
        ],
      };
      // Safely add to AND clause
      whereClause.AND = whereClause.AND
        ? [
            ...(Array.isArray(whereClause.AND)
              ? whereClause.AND
              : [whereClause.AND]),
            keywordFilter,
          ]
        : [keywordFilter];
    }

    const orderByField = dto.orderBy || 'allocatedAt';
    const orderDirection: Prisma.SortOrder = dto.asc === 'asc' ? 'asc' : 'desc';
    // Handle sorting by related fields
    const orderBy: Prisma.ProjectAllocationOrderByWithRelationInput[] =
      orderByField === 'studentName'
        ? [{ Student: { fullName: orderDirection } }]
        : orderByField === 'lecturerName'
          ? [{ Lecturer: { fullName: orderDirection } }]
          : [{ [orderByField]: orderDirection }];

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.projectAllocation.findMany({
        where: whereClause,
        include: {
          Student: {
            select: {
              id: true,
              fullName: true,
              studentCode: true,
              email: true,
              departmentId: true,
              Department: { select: { id: true, name: true } },
            },
          },
          Lecturer: {
            select: {
              id: true,
              fullName: true,
              facultyCode: true,
              email: true,
              departmentId: true,
              Department: { select: { id: true, name: true } },
            },
          },
          CreatedByFaculty: { select: { id: true, fullName: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.projectAllocation.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async findById(id: string) {
    const allocation = await this.prisma.projectAllocation.findUnique({
      where: { id },
      include: {
        Student: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
            email: true,
            departmentId: true,
            Department: { select: { id: true, name: true } },
          },
        },
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            email: true,
            departmentId: true,
            Department: { select: { id: true, name: true } },
          },
        },
        CreatedByFaculty: { select: { id: true, fullName: true } },
      },
    });
    if (!allocation) {
      throw new NotFoundException(
        `Không tìm thấy phân công đề tài với ID: ${id}`,
      );
    }
    return allocation;
  }

  async update(
    id: string,
    dto: UpdateProjectAllocationDto,
    requesterId: string,
  ) {
    const existing = await this.prisma.projectAllocation.findUnique({
      where: { id },
      select: { id: true }, // Select only needed field for existence check
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy phân công đề tài với ID: ${id}`,
      );
    }
    // Add permission checks if required (e.g., only creator or admin)

    const updateData: Prisma.ProjectAllocationUpdateInput = {
      updatedAt: new Date(),
    };
    if (dto.topicTitle) updateData.topicTitle = dto.topicTitle;
    if (dto.lecturerId) {
      updateData.Lecturer = { connect: { id: dto.lecturerId } }; // Correct way to update relation
    }

    return this.prisma.projectAllocation.update({
      where: { id },
      data: updateData,
      include: {
        Student: { select: { id: true, fullName: true, studentCode: true } },
        Lecturer: { select: { id: true, fullName: true, facultyCode: true } },
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.projectAllocation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy phân công đề tài với ID: ${id}`,
      );
    }
    // Add permission checks if required

    await this.prisma.projectAllocation.delete({ where: { id } });
    // No return needed, controller handles success response
  }

  async findByStudent(studentId: string) {
    return this.prisma.projectAllocation.findMany({
      where: { studentId },
      include: {
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            email: true,
            departmentId: true,
            Department: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async findByLecturer(lecturerId: string) {
    return this.prisma.projectAllocation.findMany({
      where: { lecturerId },
      include: {
        Student: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
            email: true,
            departmentId: true,
            Department: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async getRecommendations(dto: RecommendationExportDto): Promise<any> {
    const { departmentId, maxStudentsPerLecturer, format } = dto;

    // 1. Fetch relevant Student Selections (Approved)
    const studentSelectionWhere: Prisma.StudentSelectionWhereInput = {
      status: StudentSelectionStatusT.APPROVED,
      lecturerId: { not: null },
    };

    if (departmentId) {
      // When departmentId is specified, modify query to get related students or lecturers
      studentSelectionWhere.OR = [
        { Student: { departmentId } },
        {
          lecturerId: {
            in: await this.getLecturerIdsByDepartment(departmentId),
          },
        },
      ] as any; // Type assertion to bypass type checking limitations
    }

    const studentSelections = await this.prisma.studentSelection.findMany({
      where: studentSelectionWhere,
      include: {
        Student: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
            departmentId: true,
            Department: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: [{ studentId: 'asc' }, { priority: 'asc' }],
    });

    if (studentSelections.length === 0) {
      console.log('No approved student selections found for criteria.');
      return format === 'json'
        ? []
        : this.generateEmptyExcel('Không có dữ liệu đăng ký hợp lệ.');
    }

    // Get lecturer IDs from the selections for detailed fetch
    const lecturerIds = studentSelections
      .map((sel) => sel.lecturerId)
      .filter((id) => !!id) as string[];

    // Fetch lecturer details separately
    const lecturerDetails =
      lecturerIds.length > 0
        ? await this.prisma.faculty.findMany({
            where: { id: { in: lecturerIds } },
            select: {
              id: true,
              fullName: true,
              facultyCode: true,
              departmentId: true,
              Department: { select: { id: true, name: true } },
            },
          })
        : [];

    // Map lecturers for easy lookup
    const lecturerMap = new Map(lecturerDetails.map((l) => [l.id, l]));

    // 2. Fetch relevant Lecturer Selections (Approved) & Calculate Capacities
    const lecturerSelectionWhere: Prisma.LecturerSelectionWhereInput = {
      status: 'APPROVED',
      isActive: true,
    };
    if (departmentId) {
      // When departmentId is specified, get lecturers in that department
      lecturerSelectionWhere.Lecturer = { departmentId };
    }
    const lecturerSelections = await this.prisma.lecturerSelection.findMany({
      where: lecturerSelectionWhere,
      select: {
        lecturerId: true,
        capacity: true,
        topicTitle: true,
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            departmentId: true,
            Department: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Map lecturerId -> capacity, workload, available topics
    const lecturerWorkload = new Map<
      string,
      { capacity: number; assignedCount: number; topics: string[] }
    >();
    lecturerSelections.forEach((ls) => {
      const capacity = maxStudentsPerLecturer ?? ls.capacity;
      const current = lecturerWorkload.get(ls.lecturerId);
      if (!current) {
        lecturerWorkload.set(ls.lecturerId, {
          capacity,
          assignedCount: 0,
          topics: [ls.topicTitle],
        });
      } else {
        current.capacity = Math.max(current.capacity, capacity); // Use max capacity if multiple selections
        current.topics.push(ls.topicTitle);
      }
    });

    // 3. Preference-Based Allocation Pass
    const allocations: CreateProjectAllocationDto[] = [];
    const allocatedStudentIds = new Set<string>();

    // Group preferences by student
    const studentPreferences = studentSelections.reduce(
      (acc, sel) => {
        if (!acc[sel.studentId]) acc[sel.studentId] = [];
        if (sel.lecturerId && lecturerWorkload.has(sel.lecturerId)) {
          const defaultTopic =
            lecturerWorkload.get(sel.lecturerId)?.topics[0] ||
            'Đề tài nghiên cứu';
          acc[sel.studentId].push({
            lecturerId: sel.lecturerId,
            topicTitle: sel.topicTitle || defaultTopic,
            priority: sel.priority,
          });
        }
        return acc;
      },
      {} as Record<
        string,
        { lecturerId: string; topicTitle: string; priority: number }[]
      >,
    );

    // Process students based on their preferences
    for (const studentId in studentPreferences) {
      const preferences = studentPreferences[studentId]; // Already sorted by priority
      for (const pref of preferences) {
        const lecturer = lecturerWorkload.get(pref.lecturerId);
        if (lecturer && lecturer.assignedCount < lecturer.capacity) {
          allocations.push({
            studentId,
            lecturerId: pref.lecturerId,
            topicTitle: pref.topicTitle,
          });
          lecturer.assignedCount++;
          allocatedStudentIds.add(studentId);
          break; // Allocate to the first available preference
        }
      }
    }

    // 4. Random Allocation Pass for Unallocated Students
    // Get student objects from selections with unique IDs
    const studentMap = new Map();
    studentSelections.forEach((selection) => {
      if (selection.Student) {
        studentMap.set(selection.Student.id, selection.Student);
      }
    });

    const uniqueStudentsFromSelections = Array.from(studentMap.values());
    const unallocatedStudents = uniqueStudentsFromSelections.filter(
      (s) => !allocatedStudentIds.has(s.id),
    );

    if (unallocatedStudents.length > 0) {
      console.log(
        `Attempting random allocation for ${unallocatedStudents.length} students.`,
      );
      const availableLecturers = Array.from(lecturerWorkload.entries())
        .filter(([_, data]) => data.assignedCount < data.capacity)
        .map(([id, data]) => ({
          id,
          remainingCapacity: data.capacity - data.assignedCount,
          topics: data.topics,
        }));

      if (availableLecturers.length > 0) {
        // Shuffle available lecturers for better randomness
        availableLecturers.sort(() => Math.random() - 0.5);

        unallocatedStudents.forEach((student) => {
          // Filter potential lecturers: must have capacity AND match student's department if no global dept filter was applied
          const potentialLecturers = availableLecturers.filter((l) => {
            const lecturerData = lecturerSelections.find(
              (ls) => ls.lecturerId === l.id,
            )?.Lecturer;
            // Only assign if lecturer has capacity AND either no department filter or lecturer matches student's dept
            return (
              l.remainingCapacity > 0 &&
              (!departmentId ||
                lecturerData?.departmentId === student.departmentId)
            );
          });

          if (potentialLecturers.length > 0) {
            const chosenLecturer = potentialLecturers[0]; // Pick the first random available one
            allocations.push({
              studentId: student.id,
              lecturerId: chosenLecturer.id,
              topicTitle:
                chosenLecturer.topics[0] || 'Đề tài được phân công ngẫu nhiên',
            });
            allocatedStudentIds.add(student.id);

            // Update workload map & available list
            const lecturerData = lecturerWorkload.get(chosenLecturer.id)!;
            lecturerData.assignedCount++;
            chosenLecturer.remainingCapacity--; // Decrement remaining capacity in the available list
            // Optional: re-sort or remove if remainingCapacity is 0
            if (chosenLecturer.remainingCapacity <= 0) {
              const indexToRemove = availableLecturers.findIndex(
                (l) => l.id === chosenLecturer.id,
              );
              if (indexToRemove > -1)
                availableLecturers.splice(indexToRemove, 1);
            }
          } else {
            console.warn(
              `Could not find suitable random lecturer for student ${student.studentCode}`,
            );
          }
        });
      } else {
        console.warn(
          'No lecturers with remaining capacity for random allocation.',
        );
      }
    }

    // 5. Enrich and Format Output
    const enrichedAllocations =
      await this.enrichAllocationsWithDetails(allocations);

    // For department-specific exports, do final filtering to ensure
    // at least one of student/lecturer belongs to the department
    if (departmentId) {
      const filteredAllocations = enrichedAllocations.filter((allocation) => {
        const studentDept = allocation.student?.departmentId;
        const lecturerDept = allocation.lecturer?.departmentId;
        return studentDept === departmentId || lecturerDept === departmentId;
      });

      if (filteredAllocations.length === 0) {
        console.log(
          'No allocations match department criteria after filtering.',
        );
        return format === 'json'
          ? []
          : this.generateEmptyExcel(
              'Không có phân công hợp lệ cho khoa được chọn.',
            );
      }

      if (format === 'json') {
        return filteredAllocations;
      } else {
        return this.generateAllocationExcel(filteredAllocations);
      }
    }

    if (format === 'json') {
      return enrichedAllocations;
    } else {
      return this.generateAllocationExcel(enrichedAllocations);
    }
  }

  // Helper method to get lecturer IDs by department
  private async getLecturerIdsByDepartment(
    departmentId: string,
  ): Promise<string[]> {
    const lecturers = await this.prisma.faculty.findMany({
      where: { departmentId },
      select: { id: true },
    });
    return lecturers.map((l) => l.id);
  }

  async bulkCreate(
    allocationsDto: CreateProjectAllocationDto[],
    requesterId: string,
    departmentIdScope?: string,
    skipExisting: boolean = false,
  ) {
    if (!allocationsDto || allocationsDto.length === 0) {
      throw new BadRequestException(
        'Không có dữ liệu phân công nào được cung cấp.',
      );
    }

    // Skip department check if explicitly undefined
    const shouldSkipDepartmentCheck = departmentIdScope === undefined;
    console.log(
      `Department scope: ${departmentIdScope}, Skip check: ${shouldSkipDepartmentCheck}`,
    );

    // Validate requesterId exists in faculty table
    const requester = await this.prisma.faculty.findUnique({
      where: { id: requesterId },
      select: { id: true, departmentId: true },
    });

    if (!requester) {
      throw new BadRequestException(
        'Lỗi xác thực: ID người dùng không tồn tại trong bảng giảng viên. Chỉ giảng viên mới có thể tạo phân công.',
      );
    }

    // If no department scope was specified but requester has a department, use it
    // Only if we're not explicitly skipping department check
    if (
      !shouldSkipDepartmentCheck &&
      !departmentIdScope &&
      requester.departmentId
    ) {
      departmentIdScope = requester.departmentId;
      console.log(`Auto-using requester's department ID: ${departmentIdScope}`);
    }

    const studentIds = allocationsDto.map((a) => a.studentId);
    const lecturerIds = allocationsDto.map((a) => a.lecturerId);

    // Initialize variables for tracking skipped allocations
    let skippedCount = 0;

    // Check for duplicate students within the input list
    const uniqueStudentIds = new Set(studentIds);
    if (uniqueStudentIds.size !== studentIds.length) {
      const duplicateCounts = studentIds.reduce(
        (acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const duplicates = Object.entries(duplicateCounts)
        .filter(([_, count]) => count > 1)
        .map(([id, _]) => id);
      throw new BadRequestException(
        `Sinh viên bị trùng lặp trong danh sách: ${duplicates.join(', ')}`,
      );
    }

    // --- Validation ---
    // 1. Check existing allocations in DB
    const existingAllocations = await this.prisma.projectAllocation.findMany({
      where: { studentId: { in: studentIds } },
      select: {
        studentId: true,
        Student: { select: { fullName: true, studentCode: true } },
      },
    });

    if (existingAllocations.length > 0) {
      // Create a set of existing student IDs for filtering
      const existingStudentIds = new Set(
        existingAllocations.map((a) => a.studentId),
      );

      if (!skipExisting) {
        // Original behavior: throw error for existing allocations
        const details = existingAllocations.map(
          (a) => `${a.Student.fullName} (${a.Student.studentCode})`,
        );
        throw new BadRequestException(
          `Các sinh viên sau đã được phân công: ${details.join(', ')}`,
        );
      } else {
        // Skip existing: filter out students that already have allocations
        const originalCount = allocationsDto.length;
        allocationsDto = allocationsDto.filter(
          (dto) => !existingStudentIds.has(dto.studentId),
        );

        // If all students already have allocations, return early
        if (allocationsDto.length === 0) {
          return {
            success: true,
            count: 0,
            skipped: existingAllocations.length,
            message: `Tất cả ${existingAllocations.length} sinh viên đã được phân công trước đó.`,
          };
        }

        // Update skippedCount
        skippedCount = originalCount - allocationsDto.length;
        console.log(`Skipping ${skippedCount} already allocated students.`);

        // Update our studentIds array to match the filtered allocationsDto
        const updatedStudentIds = allocationsDto.map((a) => a.studentId);
        // Update lecturerIds as well
        const updatedLecturerIds = allocationsDto.map((a) => a.lecturerId);

        // Replace the original arrays with updated ones
        studentIds.length = 0;
        lecturerIds.length = 0;
        studentIds.push(...updatedStudentIds);
        lecturerIds.push(...updatedLecturerIds);
      }
    }

    // 2. Verify students & lecturers exist and check department scope
    const [students, lecturers] = await Promise.all([
      this.prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: {
          id: true,
          departmentId: true,
          fullName: true,
          studentCode: true,
        },
      }),
      this.prisma.faculty.findMany({
        where: { id: { in: lecturerIds } },
        select: { id: true, departmentId: true, fullName: true },
      }),
    ]);

    const studentMap = new Map(students.map((s) => [s.id, s]));
    const lecturerMap = new Map(lecturers.map((l) => [l.id, l]));

    // Check for missing students - try case-insensitive matching
    const missingStudentIds = studentIds.filter((id) => !studentMap.has(id));
    if (missingStudentIds.length > 0) {
      // Try finding students with case-insensitive comparison
      const lowerCaseStudents = await this.prisma.student.findMany({
        where: {
          id: {
            in: missingStudentIds.map((id) => id.toLowerCase()),
          },
        },
        select: {
          id: true,
          departmentId: true,
          fullName: true,
          studentCode: true,
        },
      });

      // Create a map for lookup
      const lowerToStudentMap = new Map();
      lowerCaseStudents.forEach((student) => {
        lowerToStudentMap.set(student.id.toLowerCase(), student);
      });

      // Update allocations with correct casing
      for (const allocation of allocationsDto) {
        if (missingStudentIds.includes(allocation.studentId)) {
          const lowerCaseId = allocation.studentId.toLowerCase();
          const matchedStudent = lowerToStudentMap.get(lowerCaseId);
          if (matchedStudent) {
            allocation.studentId = matchedStudent.id;
            studentMap.set(matchedStudent.id, matchedStudent);
          }
        }
      }

      // Check if there are any remaining missing students
      const stillMissingIds = allocationsDto
        .filter((a) => missingStudentIds.includes(a.studentId))
        .filter((a) => !studentMap.has(a.studentId))
        .map((a) => a.studentId);

      if (stillMissingIds.length > 0) {
        throw new BadRequestException(
          `Không tìm thấy sinh viên với các ID: ${stillMissingIds.join(', ')}`,
        );
      }
    }

    // Check for missing lecturers - try case-insensitive matching
    const missingLecturerIds = lecturerIds.filter((id) => !lecturerMap.has(id));
    if (missingLecturerIds.length > 0) {
      // Try finding lecturers with case-insensitive comparison
      const lowerCaseLecturers = await this.prisma.faculty.findMany({
        where: {
          id: {
            in: missingLecturerIds.map((id) => id.toLowerCase()),
          },
        },
        select: {
          id: true,
          departmentId: true,
          fullName: true,
        },
      });

      // Create a map for lookup
      const lowerToLecturerMap = new Map();
      lowerCaseLecturers.forEach((lecturer) => {
        lowerToLecturerMap.set(lecturer.id.toLowerCase(), lecturer);
      });

      // Update allocations with correct casing
      for (const allocation of allocationsDto) {
        if (missingLecturerIds.includes(allocation.lecturerId)) {
          const lowerCaseId = allocation.lecturerId.toLowerCase();
          const matchedLecturer = lowerToLecturerMap.get(lowerCaseId);
          if (matchedLecturer) {
            allocation.lecturerId = matchedLecturer.id;
            lecturerMap.set(matchedLecturer.id, matchedLecturer);
          }
        }
      }

      // Check if there are any remaining missing lecturers
      const stillMissingIds = allocationsDto
        .filter((a) => missingLecturerIds.includes(a.lecturerId))
        .filter((a) => !lecturerMap.has(a.lecturerId))
        .map((a) => a.lecturerId);

      if (stillMissingIds.length > 0) {
        throw new BadRequestException(
          `Không tìm thấy giảng viên với các ID: ${stillMissingIds.join(', ')}`,
        );
      }
    }

    // 3. Department Scope Validation - only if we have a department scope and not skipping checks
    if (departmentIdScope && !shouldSkipDepartmentCheck) {
      console.log(`Validating department scope: ${departmentIdScope}`);
      const invalidDepartmentAllocations = allocationsDto.filter((alloc) => {
        const studentDept = studentMap.get(alloc.studentId)?.departmentId;
        const lecturerDept = lecturerMap.get(alloc.lecturerId)?.departmentId;

        // MORE PERMISSIVE: Allow if EITHER student OR lecturer belongs to the department
        return (
          studentDept !== departmentIdScope && // Student not in department
          lecturerDept !== departmentIdScope // AND lecturer not in department
        );
      });

      if (invalidDepartmentAllocations.length > 0) {
        // If skipExisting is true, also allow skipping cross-department allocations
        if (skipExisting) {
          // Get a list of valid allocations
          const originalCount = allocationsDto.length;
          allocationsDto = allocationsDto.filter((alloc) => {
            const studentDept = studentMap.get(alloc.studentId)?.departmentId;
            const lecturerDept = lecturerMap.get(
              alloc.lecturerId,
            )?.departmentId;
            // Include if EITHER student OR lecturer is in the department
            return (
              studentDept === departmentIdScope ||
              lecturerDept === departmentIdScope
            );
          });

          // Update skipped count
          const newSkippedCount = originalCount - allocationsDto.length;
          skippedCount += newSkippedCount;
          console.log(
            `Skipping ${newSkippedCount} allocations due to department mismatch.`,
          );

          // If all allocations were skipped, return early
          if (allocationsDto.length === 0) {
            return {
              success: true,
              count: 0,
              skipped: skippedCount,
              message: `Tất cả sinh viên đã được phân công trước đó hoặc không thuộc khoa của bạn.`,
            };
          }

          // Update studentIds and lecturerIds arrays again
          const updatedStudentIds = allocationsDto.map((a) => a.studentId);
          const updatedLecturerIds = allocationsDto.map((a) => a.lecturerId);
          studentIds.length = 0;
          lecturerIds.length = 0;
          studentIds.push(...updatedStudentIds);
          lecturerIds.push(...updatedLecturerIds);
        } else {
          // Standard error behavior
          const details = invalidDepartmentAllocations.map(
            (a) =>
              `SV: ${studentMap.get(a.studentId)?.studentCode}, GV: ${lecturerMap.get(a.lecturerId)?.fullName}`,
          );
          throw new BadRequestException(
            `Phân công không hợp lệ (SV và GV không thuộc khoa ${departmentIdScope}): ${details.join('; ')}`,
          );
        }
      }
    } else {
      console.log('Skipping department validation check');
    }

    // --- Creation ---
    const projectAllocationIds: string[] = [];
    const dataToCreate = allocationsDto.map((allocation) => {
      const id = uuidv7();
      projectAllocationIds.push(id);
      return {
        id,
        topicTitle: allocation.topicTitle,
        studentId: allocation.studentId,
        lecturerId: allocation.lecturerId,
        createdById: requesterId,
        allocatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    console.log(`Creating ${dataToCreate.length} allocations with uuidv7 IDs`);

    const result = await this.prisma.projectAllocation.createMany({
      data: dataToCreate,
      skipDuplicates: false,
    });

    // If allocations were created, automatically create proposed projects for each allocation
    if (result.count > 0) {
      try {
        // Find the newly created allocations with full details
        const createdAllocations = await this.prisma.projectAllocation.findMany(
          {
            where: { id: { in: projectAllocationIds } },
            include: {
              Student: { select: { id: true } },
              Lecturer: { select: { id: true } },
            },
          },
        );

        // Create proposed projects for each allocation
        const proposedProjects = await Promise.all(
          createdAllocations.map(async (allocation) => {
            // Check if a proposed project already exists for this allocation
            const existingProposal =
              await this.prisma.proposedProject.findUnique({
                where: { projectAllocationId: allocation.id },
                select: { id: true },
              });

            if (existingProposal) {
              return null; // Skip if already exists
            }

            // Create the proposed project
            const proposedProject = await this.prisma.proposedProject.create({
              data: {
                projectAllocationId: allocation.id,
                title: `Đề xuất từ phân công: ${allocation.topicTitle}`,
                status: 'TOPIC_SUBMISSION_PENDING',
                createdByFacultyId: requesterId,
              },
            });

            // Create student member
            if (allocation.studentId) {
              await this.prisma.proposedProjectMember.create({
                data: {
                  proposedProjectId: proposedProject.id,
                  studentId: allocation.studentId,
                  role: MEMBER_ROLES.STUDENT,
                  status: 'ACTIVE',
                },
              });
            }

            // Create advisor member if lecturer exists
            if (allocation.lecturerId) {
              await this.prisma.proposedProjectMember.create({
                data: {
                  proposedProjectId: proposedProject.id,
                  facultyId: allocation.lecturerId,
                  role: MEMBER_ROLES.ADVISOR,
                  status: 'ACTIVE',
                },
              });
            }

            return proposedProject;
          }),
        );

        const successfulProposals = proposedProjects.filter((p) => p !== null);

        // Include information about skipped allocations if any
        let message = `Đã tạo ${result.count} phân công.`;
        if (skippedCount > 0) {
          message += ` Đã bỏ qua ${skippedCount} sinh viên đã được phân công trước đó.`;
        }
        if (successfulProposals.length > 0) {
          message += ` Đã tạo ${successfulProposals.length} đề xuất dự án với ${successfulProposals.length * 2} thành viên.`;
        }

        return {
          success: true,
          count: result.count,
          skipped: skippedCount,
          proposedProjectsCreated: successfulProposals.length,
          message,
        };
      } catch (error) {
        console.error('Error creating proposed projects:', error);
        // Return success for allocations but inform about proposed project creation failure
        let message = `Đã tạo ${result.count} phân công.`;
        if (skippedCount > 0) {
          message += ` Đã bỏ qua ${skippedCount} sinh viên đã được phân công trước đó.`;
        }

        return {
          success: true,
          count: result.count,
          skipped: skippedCount,
          proposedProjectsCreated: 0,
          warning:
            'Phân công thành công nhưng không thể tạo đề xuất dự án tự động. Lỗi: ' +
            error.message,
          message,
        };
      }
    }

    // Handle the case where no records were created
    return {
      success: true,
      count: result.count,
      skipped: skippedCount || 0,
      message:
        skippedCount > 0
          ? `Đã bỏ qua ${skippedCount} sinh viên đã được phân công trước đó.`
          : undefined,
    };
  }

  async parseExcelAllocations(
    buffer: Buffer,
  ): Promise<CreateProjectAllocationDto[]> {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
    } catch (error) {
      console.error('Error loading Excel buffer:', error);
      throw new BadRequestException(
        'Không thể đọc file Excel. Định dạng không hợp lệ hoặc file bị lỗi.',
      );
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('File Excel không có worksheet nào.');
    }

    const allocations: CreateProjectAllocationDto[] = [];
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values as string[]; // Get header values

    // Find column indices based on keys defined in generateAllocationExcel
    let studentIdCol = -1;
    let lecturerIdCol = -1;
    let topicTitleCol = -1;

    // Iterate through columns to find ID columns
    worksheet.columns.forEach((column, index) => {
      const header = headers[index + 1];
      if (!header) return;

      // Match column using header text
      const headerText = header.toString().toLowerCase().trim();
      if (headerText === 'id sinh viên' || headerText === 'student id') {
        studentIdCol = index + 1;
      } else if (
        headerText === 'id giảng viên' ||
        headerText === 'lecturer id'
      ) {
        lecturerIdCol = index + 1;
      } else if (
        headerText === 'tiêu đề đề tài' ||
        headerText === 'topic title'
      ) {
        topicTitleCol = index + 1;
      }
    });

    // If columns weren't found by header text, try using column keys
    if (studentIdCol === -1 || lecturerIdCol === -1 || topicTitleCol === -1) {
      worksheet.columns.forEach((column, index) => {
        // Note: ExcelJS column indices are 1-based
        if (column.key === 'studentId') {
          studentIdCol = index + 1;
        } else if (column.key === 'lecturerId') {
          lecturerIdCol = index + 1;
        } else if (column.key === 'topicTitle') {
          topicTitleCol = index + 1;
        }
      });
    }

    // Validate that required columns were found
    if (studentIdCol === -1 || lecturerIdCol === -1 || topicTitleCol === -1) {
      console.warn(
        'Required columns not found based on keys:',
        { studentIdCol, lecturerIdCol, topicTitleCol },
        'Headers found:',
        headers,
      );
      // Fallback: try searching by header text if keys fail (more brittle)
      const headerMap = new Map<string, number>();
      headers.forEach((header, index) => {
        if (header)
          headerMap.set(header.toString().toLowerCase().trim(), index); // 1-based index
      });

      const foundStudentId =
        headerMap.get('id sinh viên') || headerMap.get('student id');
      const foundLecturerId =
        headerMap.get('id giảng viên') || headerMap.get('lecturer id');
      const foundTopicTitle =
        headerMap.get('tiêu đề đề tài') || headerMap.get('topic title');

      if (foundStudentId) studentIdCol = foundStudentId;
      if (foundLecturerId) lecturerIdCol = foundLecturerId;
      if (foundTopicTitle) topicTitleCol = foundTopicTitle;

      // Final check after fallback
      if (studentIdCol === -1 || lecturerIdCol === -1 || topicTitleCol === -1) {
        throw new BadRequestException(
          'Cấu trúc cột trong file Excel không đúng. Không tìm thấy các cột bắt buộc: ID Sinh viên, ID Giảng viên, Tiêu đề đề tài dựa trên key hoặc header.',
        );
      }
      console.log('Found columns using fallback header search:', {
        studentIdCol,
        lecturerIdCol,
        topicTitleCol,
      });
    } else {
      console.log('Found columns using keys:', {
        studentIdCol,
        lecturerIdCol,
        topicTitleCol,
      });
    }

    // Start from row 2
    console.log('Starting Excel parsing from row 2...');
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      // Check if the row seems completely empty based on the required columns
      if (
        !row.getCell(studentIdCol).value &&
        !row.getCell(lecturerIdCol).value &&
        !row.getCell(topicTitleCol).value
      ) {
        console.log(`Skipping empty row ${rowNumber}`);
        continue;
      }

      // Use determined column indices
      const studentId = row.getCell(studentIdCol).value?.toString()?.trim();
      const lecturerId = row.getCell(lecturerIdCol).value?.toString()?.trim();
      const topicTitle = row.getCell(topicTitleCol).value?.toString()?.trim();

      // Log the raw values for debugging
      console.log(`Row ${rowNumber} data:`, {
        studentId,
        lecturerId,
        topicTitle,
      });

      // Basic check for non-empty required fields
      if (studentId && lecturerId && topicTitle) {
        allocations.push({ studentId, lecturerId, topicTitle });
      } else {
        // Warn if row has some data but not all required, potentially skipping
        console.warn(
          `Skipping row ${rowNumber} due to missing required data after extraction:`,
          { studentId, lecturerId, topicTitle },
        );
        // Optionally, throw an error here if strict validation is needed
        // throw new BadRequestException(`Dữ liệu bị thiếu ở dòng ${rowNumber}. Cần ID Sinh viên, ID Giảng viên, và Tiêu đề đề tài.`);
      }
    }

    console.log(
      `Excel parsing complete. Found ${allocations.length} valid allocations`,
    );

    if (allocations.length === 0) {
      throw new BadRequestException(
        'Không tìm thấy dữ liệu phân công hợp lệ trong file Excel sau khi xử lý.',
      );
    }
    return allocations;
  }

  private async enrichAllocationsWithDetails(
    allocations: CreateProjectAllocationDto[],
  ): Promise<any[]> {
    const studentIds = [...new Set(allocations.map((a) => a.studentId))]; // Unique IDs
    const lecturerIds = [...new Set(allocations.map((a) => a.lecturerId))]; // Unique IDs

    const [students, lecturers] = await Promise.all([
      this.prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: {
          id: true,
          fullName: true,
          studentCode: true,
          email: true,
          departmentId: true,
          Department: { select: { id: true, name: true } },
        },
      }),
      this.prisma.faculty.findMany({
        where: { id: { in: lecturerIds } },
        select: {
          id: true,
          fullName: true,
          facultyCode: true,
          email: true,
          departmentId: true,
          Department: { select: { id: true, name: true } },
        },
      }),
    ]);

    const studentMap = new Map(students.map((s) => [s.id, s]));
    const lecturerMap = new Map(lecturers.map((l) => [l.id, l]));

    return allocations.map((allocation) => {
      const student = studentMap.get(allocation.studentId);
      const lecturer = lecturerMap.get(allocation.lecturerId);
      return {
        studentId: allocation.studentId,
        lecturerId: allocation.lecturerId,
        topicTitle: allocation.topicTitle,
        student: student
          ? {
              // Flatten structure slightly
              fullName: student.fullName,
              studentCode: student.studentCode,
              email: student.email,
              department: student.Department?.name,
              departmentId: student.departmentId,
            }
          : null,
        lecturer: lecturer
          ? {
              fullName: lecturer.fullName,
              facultyCode: lecturer.facultyCode,
              email: lecturer.email,
              department: lecturer.Department?.name,
              departmentId: lecturer.departmentId,
            }
          : null,
      };
    });
  }

  private async generateAllocationExcel(
    allocations: any[],
  ): Promise<{ buffer: Buffer; fileName: string; contentType: string }> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Phân công đề tài');

    // IMPORTANT: Ensure the 'key' matches what parseExcelAllocations expects
    worksheet.columns = [
      { header: 'Mã sinh viên', key: 'studentCode', width: 15 },
      { header: 'Họ tên sinh viên', key: 'studentName', width: 25 },
      { header: 'Email sinh viên', key: 'studentEmail', width: 30 },
      { header: 'Khoa sinh viên', key: 'studentDept', width: 25 },
      { header: 'Mã giảng viên', key: 'lecturerCode', width: 15 },
      { header: 'Họ tên giảng viên', key: 'lecturerName', width: 25 },
      { header: 'Email giảng viên', key: 'lecturerEmail', width: 30 },
      { header: 'Khoa giảng viên', key: 'lecturerDept', width: 25 },
      { header: 'Tiêu đề đề tài', key: 'topicTitle', width: 40 }, // Key: topicTitle
      { header: 'ID Sinh viên', key: 'studentId', width: 36 }, // Key: studentId - Make visible and fixed width for UUIDs
      { header: 'ID Giảng viên', key: 'lecturerId', width: 36 }, // Key: lecturerId - Make visible and fixed width for UUIDs
    ];

    // Add rows using the enriched data structure
    allocations.forEach((allocation) => {
      worksheet.addRow({
        studentCode: allocation.student?.studentCode,
        studentName: allocation.student?.fullName,
        studentEmail: allocation.student?.email,
        studentDept: allocation.student?.department,
        lecturerCode: allocation.lecturer?.facultyCode,
        lecturerName: allocation.lecturer?.fullName,
        lecturerEmail: allocation.lecturer?.email,
        lecturerDept: allocation.lecturer?.department,
        topicTitle: allocation.topicTitle,
        studentId: allocation.studentId,
        lecturerId: allocation.lecturerId,
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.autoFilter = {
      from: 'A1',
      // Apply filter to all columns
      to: {
        row: 1,
        column: worksheet.columns.length,
      },
    };

    // Cast to unknown first to resolve Buffer type conflict
    const buffer = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return {
      buffer,
      fileName: 'phan_cong_de_tai_de_xuat.xlsx',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }

  private async generateEmptyExcel(
    message: string,
  ): Promise<{ buffer: Buffer; fileName: string; contentType: string }> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Kết quả');
    worksheet.getCell('A1').value = message;
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getColumn('A').width = 60; // Wider column

    // Cast to unknown first to resolve Buffer type conflict
    const buffer = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return {
      buffer,
      fileName: 'ket_qua.xlsx',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }
}
