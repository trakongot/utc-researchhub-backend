import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  ProjectMemberStatusT,
  ProjectT,
  ProposalStatusT,
  ProposedProjectMemberStatusT,
  ProposedProjectStatusT,
  UserT,
} from '@prisma/client';
import { AuthPayload } from 'src/common/interface';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import {
  AdvisorReviewDto,
  CreateProposedProjectTriggerDto,
  DepartmentHeadReviewDto,
  FindProposedProjectDto,
  HeadApprovalDto,
  LockProposalOutlineDto,
  ManageProposedMemberDto,
  ReviewProposalOutlineDto,
  SubmitProposalOutlineDto,
  UpdateProposedProjectDto,
  UpdateStatusDto,
} from './schema';

const MEMBER_ROLES = {
  ADVISOR: 'ADVISOR',
  STUDENT: 'STUDENT',
  MEMBER: 'MEMBER',
  LEADER: 'LEADER',
};

@Injectable()
export class ProposedProjectService {
  constructor(private prisma: PrismaService) {}

  // PHASE 1: Initialize proposal from ProjectAllocation
  async createFromAllocation(
    dto: CreateProposedProjectTriggerDto,
    user: AuthPayload,
  ): Promise<any> {
    // Check if ProjectAllocation exists
    const allocation = await this.prisma.projectAllocation.findUnique({
      where: { id: dto.projectAllocationId },
      include: {
        Lecturer: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!allocation) {
      throw new NotFoundException('Project allocation record not found');
    }

    // Check permissions: Only FACULTY can create
    const isFaculty = user.userType === UserT.FACULTY;
    if (!isFaculty) {
      throw new ForbiddenException('No permission to create project proposal');
    }

    // Check if ProposedProject for this allocation already exists
    const existingProposal = await this.prisma.proposedProject.findUnique({
      where: { projectAllocationId: dto.projectAllocationId },
    });

    if (existingProposal) {
      throw new BadRequestException(
        'A proposal already exists for this allocation',
      );
    }

    // Create ProposedProject
    const proposedProject = await this.prisma.proposedProject.create({
      data: {
        projectAllocationId: allocation.id,
        title: `Proposal from allocation ${allocation.id}`, // Temporary title, student will update later
        status: ProposedProjectStatusT.TOPIC_SUBMISSION_PENDING,
        createdByFacultyId: user.id,
      },
    });

    // Create ProposedProjectMember for student in allocation
    await this.prisma.proposedProjectMember.create({
      data: {
        proposedProjectId: proposedProject.id,
        studentId: allocation.studentId,
        role: MEMBER_ROLES.STUDENT,
        status: ProposedProjectMemberStatusT.ACTIVE,
      },
    });

    // Create ProposedProjectMember for advisor (faculty) if available
    if (allocation.lecturerId) {
      await this.prisma.proposedProjectMember.create({
        data: {
          proposedProjectId: proposedProject.id,
          facultyId: allocation.lecturerId,
          role: MEMBER_ROLES.ADVISOR,
          status: ProposedProjectMemberStatusT.ACTIVE,
        },
      });
    }

    return proposedProject;
  }

  // PHASE 2: Student updates project title
  async updateProposedProject(
    id: string,
    dto: UpdateProposedProjectDto,
    user: AuthPayload,
  ): Promise<any> {
    // Check if ProposedProject exists
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: true,
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // Check permissions: Student must be an ACTIVE member of the proposal
    const canUpdate =
      user.userType === UserT.STUDENT &&
      proposedProject.ProposedProjectMember.some(
        (member) =>
          member.studentId === user.id &&
          member.status === ProposedProjectMemberStatusT.ACTIVE,
      );

    if (!canUpdate) {
      throw new ForbiddenException('No permission to update project proposal');
    }

    // Update status if student wants to submit to advisor for approval
    const status = dto.submitToAdvisor
      ? ProposedProjectStatusT.TOPIC_PENDING_ADVISOR
      : proposedProject.status;

    // Update ProposedProject
    const updatedProposedProject = await this.prisma.proposedProject.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status,
      },
    });

    return updatedProposedProject;
  }

  // PHASE 3: Advisor reviews project title
  async advisorReview(
    id: string,
    dto: AdvisorReviewDto,
    user: AuthPayload,
  ): Promise<any> {
    // Check if ProposedProject exists
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: true,
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // Check permissions: Must be the ADVISOR of the proposal
    const isAdvisor =
      user.userType === UserT.FACULTY &&
      proposedProject.ProposedProjectMember.some(
        (member) =>
          member.facultyId === user.id &&
          member.role === MEMBER_ROLES.ADVISOR &&
          member.status === ProposedProjectMemberStatusT.ACTIVE,
      );

    if (!isAdvisor) {
      throw new ForbiddenException('No permission to review project proposal');
    }

    // Update status
    const updatedProposedProject = await this.prisma.proposedProject.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    // Add comment if provided
    if (dto.comment) {
      await this.prisma.proposedProjectComment.create({
        data: {
          proposedProjectId: id,
          content: dto.comment,
          commenterFacultyId: user.id,
        },
      });
    }

    return updatedProposedProject;
  }

  // PHASE 4: Department head reviews project
  async departmentHeadReview(
    id: string,
    dto: DepartmentHeadReviewDto,
    user: AuthPayload,
  ): Promise<any> {
    // Check if ProposedProject exists
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          include: {
            Faculty: true,
          },
        },
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // Check permissions: Must be FACULTY
    if (user.userType !== UserT.FACULTY) {
      throw new ForbiddenException('No permission to review project proposal');
    }

    // Check if user has department head permissions for this project's department
    // The department is determined from the advisor's department
    const advisorMember = proposedProject.ProposedProjectMember.find(
      (member) => member.role === MEMBER_ROLES.ADVISOR && member.Faculty,
    );

    if (!advisorMember?.Faculty?.departmentId) {
      throw new BadRequestException('Project has no associated department');
    }

    // Verify the user has department head role in the same department as the advisor
    const userIsDepartmentHead =
      user.roles.includes('DEPARTMENT_HEAD') &&
      user.departmentId === advisorMember.Faculty.departmentId;

    if (!userIsDepartmentHead) {
      throw new ForbiddenException(
        'No permission to review projects from this department',
      );
    }

    // Update status
    const updatedProposedProject = await this.prisma.proposedProject.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    // Add comment if provided
    if (dto.comment) {
      await this.prisma.proposedProjectComment.create({
        data: {
          proposedProjectId: id,
          content: dto.comment,
          commenterFacultyId: user.id,
        },
      });
    }

    return updatedProposedProject;
  }

  // PHASE 5: Faculty head approves and creates official project
  async headApproval(
    id: string,
    dto: HeadApprovalDto,
    user: AuthPayload,
  ): Promise<any> {
    // Check if ProposedProject exists
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          where: { status: ProposedProjectMemberStatusT.ACTIVE },
          include: {
            Student: true,
            Faculty: true,
          },
        },
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // Check permissions: Must be FACULTY
    if (user.userType !== UserT.FACULTY) {
      throw new ForbiddenException(
        'No permission for final project proposal approval',
      );
    }

    // Check if user has faculty head permissions
    const isFacultyHead = user.roles.includes('FACULTY_HEAD');
    if (!isFacultyHead) {
      throw new ForbiddenException('Only faculty head can approve proposals');
    }

    // Use departmentId from dto or from user's AuthPayload
    const departmentId = dto.departmentId || user.departmentId;
    if (!departmentId) {
      throw new BadRequestException('Department ID is required for approval');
    }

    // Get advisor from members
    const advisorMember = proposedProject.ProposedProjectMember.find(
      (member) => member.role === MEMBER_ROLES.ADVISOR && member.Faculty,
    );

    // Verify the project belongs to the user's department
    if (advisorMember?.Faculty?.departmentId !== departmentId) {
      throw new ForbiddenException(
        'No permission to approve projects from other departments',
      );
    }

    // Update status and set approvedBy and approvedAt
    const updatedProposedProject = await this.prisma.proposedProject.update({
      where: { id },
      data: {
        status: dto.status,
        approvedById: user.id,
        approvedAt: new Date(),
      },
    });

    // Add comment if provided
    if (dto.comment) {
      await this.prisma.proposedProjectComment.create({
        data: {
          proposedProjectId: id,
          content: dto.comment,
          commenterFacultyId: user.id,
        },
      });
    }

    // Create the official project if approved
    if (dto.status === ProposedProjectStatusT.APPROVED_BY_HEAD) {
      await this.createOfficialProject(proposedProject, user.id, departmentId);
    }

    return updatedProposedProject;
  }

  // New method: Approve all pending projects in a department
  async approvePendingProposalsInDepartment(user: AuthPayload): Promise<any> {
    // Check permissions: Must be FACULTY and FACULTY_HEAD
    if (
      user.userType !== UserT.FACULTY ||
      !user.roles.includes('FACULTY_HEAD')
    ) {
      throw new ForbiddenException(
        'Only faculty head can perform bulk approval',
      );
    }

    // Get department ID from user's AuthPayload
    const departmentId = user.departmentId;
    if (!departmentId) {
      throw new BadRequestException('Department ID not found in user profile');
    }

    // Find all proposals with pending status in the user's department
    // We need to join ProposedProjectMember to get the Faculty, and then filter by department
    const pendingProposals = await this.prisma.proposedProject.findMany({
      where: {
        status: ProposedProjectStatusT.PENDING_HEAD,
        ProposedProjectMember: {
          some: {
            role: MEMBER_ROLES.ADVISOR,
            Faculty: {
              departmentId: departmentId,
            },
          },
        },
      },
      include: {
        ProposedProjectMember: {
          where: { status: ProposedProjectMemberStatusT.ACTIVE },
          include: {
            Student: true,
            Faculty: true,
          },
        },
      },
    });

    if (pendingProposals.length === 0) {
      return { message: 'No pending proposals found in this department' };
    }

    // Process each proposal
    const results: Array<{
      id: string;
      title: string;
      status: string;
      error?: string;
    }> = [];

    for (const proposal of pendingProposals) {
      try {
        // Update status and set approvedBy and approvedAt
        const updatedProposal = await this.prisma.proposedProject.update({
          where: { id: proposal.id },
          data: {
            status: ProposedProjectStatusT.APPROVED_BY_HEAD,
            approvedById: user.id,
            approvedAt: new Date(),
          },
        });

        // Add a standard comment
        await this.prisma.proposedProjectComment.create({
          data: {
            proposedProjectId: proposal.id,
            content: 'Approved in bulk approval process',
            commenterFacultyId: user.id,
          },
        });

        // Create the official project
        await this.createOfficialProject(proposal, user.id, departmentId);

        results.push({
          id: proposal.id,
          title: proposal.title,
          status: 'approved',
        });
      } catch (error) {
        results.push({
          id: proposal.id,
          title: proposal.title,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return {
      message: `Processed ${pendingProposals.length} pending proposals`,
      results,
    };
  }

  // Helper method to create official project
  private async createOfficialProject(
    proposedProject: any,
    approvedById: string,
    departmentId: string,
  ): Promise<any> {
    // Create the official project
    const project = await this.prisma.project.create({
      data: {
        type: ProjectT.RESEARCH,
        title: proposedProject.title,
        description: proposedProject.description,
        field: 'Research',
        status: 'IN_PROGRESS',
        approvedById: approvedById,
        departmentId: departmentId,
        fieldPoolId: proposedProject.fieldPoolId,
      },
    });

    // Add members to the project
    for (const member of proposedProject.ProposedProjectMember) {
      if (member.studentId) {
        await this.prisma.projectMember.create({
          data: {
            projectId: project.id,
            memberStudentId: member.studentId,
            role: member.role || MEMBER_ROLES.STUDENT,
            status: ProjectMemberStatusT.ACTIVE,
          },
        });
      } else if (member.facultyId && member.role === MEMBER_ROLES.ADVISOR) {
        await this.prisma.projectMember.create({
          data: {
            projectId: project.id,
            memberFacultyId: member.facultyId,
            role: MEMBER_ROLES.ADVISOR,
            status: ProjectMemberStatusT.ACTIVE,
          },
        });
      }
    }

    return project;
  }

  // Member management in project proposal
  async manageMembers(
    id: string,
    dto: ManageProposedMemberDto,
    user: AuthPayload,
  ): Promise<any> {
    // Check if ProposedProject exists
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          where: {
            facultyId: user.id,
            role: MEMBER_ROLES.ADVISOR,
          },
        },
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // Check permissions: Must be the ADVISOR of the proposal
    const isAdvisor =
      user.userType === UserT.FACULTY &&
      proposedProject.ProposedProjectMember.length > 0;

    if (!isAdvisor) {
      throw new ForbiddenException(
        'No permission to manage project proposal members',
      );
    }

    // Add/Remove member
    if (dto.action === 'add') {
      // Check if student is already a member
      const existingMember = await this.prisma.proposedProjectMember.findFirst({
        where: {
          proposedProjectId: id,
          studentId: dto.studentId,
        },
      });

      if (existingMember) {
        // If member exists but is REMOVED, update to ACTIVE
        if (existingMember.status === ProposedProjectMemberStatusT.REMOVED) {
          return this.prisma.proposedProjectMember.update({
            where: {
              id: existingMember.id,
            },
            data: {
              status: ProposedProjectMemberStatusT.ACTIVE,
              role: dto.role || MEMBER_ROLES.STUDENT,
            },
          });
        } else {
          throw new BadRequestException(
            'Student is already a member of this project proposal',
          );
        }
      }

      // Add new member
      return this.prisma.proposedProjectMember.create({
        data: {
          proposedProjectId: id,
          studentId: dto.studentId,
          role: dto.role || MEMBER_ROLES.STUDENT,
          status: ProposedProjectMemberStatusT.ACTIVE,
        },
      });
    } else {
      // Find the member to remove
      const memberToRemove = await this.prisma.proposedProjectMember.findFirst({
        where: {
          proposedProjectId: id,
          studentId: dto.studentId,
        },
      });

      if (!memberToRemove) {
        throw new NotFoundException(
          'Member not found in this project proposal',
        );
      }

      // Mark as REMOVED
      return this.prisma.proposedProjectMember.update({
        where: {
          id: memberToRemove.id,
        },
        data: {
          status: ProposedProjectMemberStatusT.REMOVED,
        },
      });
    }
  }

  // GIAI ĐOẠN 6: Sinh viên nộp đề cương chi tiết
  async submitProposalOutline(
    dto: SubmitProposalOutlineDto,
    user: AuthPayload,
  ): Promise<any> {
    // Kiểm tra ProposedProject tồn tại
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id: dto.proposedProjectId },
      include: {
        ProposedProjectMember: true,
        ProposalOutline: true,
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Không tìm thấy đề xuất dự án');
    }

    // Kiểm tra quyền hạn: SV phải là thành viên ACTIVE của đề xuất
    const canSubmit =
      user.userType === UserT.STUDENT &&
      proposedProject.ProposedProjectMember.some(
        (member) =>
          member.studentId === user.id &&
          member.status === ProposedProjectMemberStatusT.ACTIVE,
      );

    if (!canSubmit) {
      throw new ForbiddenException('Không có quyền nộp đề cương');
    }

    // Kiểm tra trạng thái của đề xuất - chỉ cho phép nộp đề cương khi đề tài đã được phê duyệt
    const allowedStatuses = [
      ProposedProjectStatusT.TOPIC_APPROVED,
      ProposedProjectStatusT.OUTLINE_PENDING_SUBMISSION,
      ProposedProjectStatusT.OUTLINE_REQUESTED_CHANGES,
      ProposedProjectStatusT.OUTLINE_APPROVED,
    ];

    if (!allowedStatuses.includes(proposedProject.status as any)) {
      throw new BadRequestException(
        'Chỉ được phép nộp đề cương khi đề tài đã được phê duyệt (TOPIC_APPROVED)',
      );
    }

    // Trạng thái mới nếu sinh viên muốn gửi đề cương để duyệt
    const status = dto.submitForReview
      ? ProposalStatusT.PENDING_REVIEW
      : ProposalStatusT.DRAFT;

    let updatedOutline;

    // Cập nhật hoặc tạo mới ProposalOutline
    if (proposedProject.ProposalOutline) {
      // Cập nhật ProposalOutline hiện có
      updatedOutline = await this.prisma.proposalOutline.update({
        where: { id: proposedProject.ProposalOutline.id },
        data: {
          introduction: dto.introduction,
          objectives: dto.objectives,
          methodology: dto.methodology,
          expectedResults: dto.expectedResults,
          fileId: dto.fileId,
          status,
        },
      });
    } else {
      // Tạo mới ProposalOutline nếu chưa có
      updatedOutline = await this.prisma.proposalOutline.create({
        data: {
          introduction: dto.introduction,
          objectives: dto.objectives,
          methodology: dto.methodology,
          expectedResults: dto.expectedResults,
          fileId: dto.fileId,
          status,
        },
      });

      // Liên kết ProposalOutline với ProposedProject
      await this.prisma.proposedProject.update({
        where: { id: dto.proposedProjectId },
        data: {
          proposalOutlineId: updatedOutline.id,
        },
      });
    }

    // Cập nhật trạng thái của đề xuất nếu sinh viên nộp để duyệt
    if (
      dto.submitForReview &&
      proposedProject.status === ProposedProjectStatusT.TOPIC_APPROVED
    ) {
      await this.prisma.proposedProject.update({
        where: { id: dto.proposedProjectId },
        data: {
          status: ProposedProjectStatusT.OUTLINE_PENDING_ADVISOR,
        },
      });
    }

    return updatedOutline;
  }

  // GIAI ĐOẠN 7: GVHD/TBM duyệt đề cương
  async reviewProposalOutline(
    id: string,
    dto: ReviewProposalOutlineDto,
    user: AuthPayload,
  ): Promise<any> {
    // Kiểm tra ProposalOutline tồn tại
    const proposalOutline = await this.prisma.proposalOutline.findUnique({
      where: { id },
      include: {
        Project: {
          include: {
            Members: true,
          },
        },
      },
    });

    if (!proposalOutline) {
      throw new NotFoundException('Không tìm thấy đề cương');
    }

    // Kiểm tra quyền hạn: Phải là GVHD hoặc TBM
    const isFaculty = user.userType === UserT.FACULTY;
    if (!isFaculty) {
      throw new ForbiddenException('Không có quyền duyệt đề cương');
    }

    // TODO: Thêm kiểm tra chi tiết quyền theo vai trò (GVHD hoặc TBM)

    // Cập nhật trạng thái
    const updatedOutline = await this.prisma.proposalOutline.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    // Thêm bình luận nếu có
    if (dto.comment && proposalOutline.Project) {
      await this.prisma.projectComment.create({
        data: {
          projectId: proposalOutline.Project.id,
          content: dto.comment,
          commenterFacultyId: user.id,
        },
      });
    }

    return updatedOutline;
  }

  // GIAI ĐOẠN 8: Trưởng khoa khóa đề cương
  async lockProposalOutline(
    id: string,
    dto: LockProposalOutlineDto,
    user: AuthPayload,
  ): Promise<any> {
    // Kiểm tra ProposalOutline tồn tại
    const proposalOutline = await this.prisma.proposalOutline.findUnique({
      where: { id },
    });

    if (!proposalOutline) {
      throw new NotFoundException('Không tìm thấy đề cương');
    }

    // Kiểm tra quyền hạn: Phải là TK
    if (user.userType !== UserT.FACULTY) {
      throw new ForbiddenException('Không có quyền khóa đề cương');
    }

    // TODO: Thêm kiểm tra quyền TK dựa trên department của user

    // Cập nhật trạng thái
    const updatedOutline = await this.prisma.proposalOutline.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    return updatedOutline;
  }

  // Search for project proposals
  async find(dto: FindProposedProjectDto, user: AuthPayload): Promise<any> {
    const {
      page = 1,
      limit = 10,
      status,
      advisorId,
      studentId,
      departmentId,
      fieldPoolId,
      projectAllocationId,
      keyword,
      orderBy = 'createdAt',
      asc = 'desc',
    } = dto;

    // Build search conditions
    const whereClause: Prisma.ProposedProjectWhereInput = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by advisor
    if (advisorId) {
      whereClause.ProposedProjectMember = {
        some: {
          facultyId: advisorId,
          role: MEMBER_ROLES.ADVISOR,
          status: ProposedProjectMemberStatusT.ACTIVE,
        },
      };
    }

    // Filter by student
    if (studentId) {
      whereClause.ProposedProjectMember = {
        some: {
          studentId,
          status: ProposedProjectMemberStatusT.ACTIVE,
        },
      };
    }

    // Filter by department
    if (departmentId) {
      // TODO: Implement department filtering when departmentId is added or through relations
    }

    // Filter by field pool
    if (fieldPoolId) {
      whereClause.fieldPoolId = fieldPoolId;
    }

    // Filter by allocation
    if (projectAllocationId) {
      whereClause.projectAllocationId = projectAllocationId;
    }

    // Search by keyword
    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Filter by permissions
    if (user.userType === UserT.STUDENT) {
      // Students can only see their proposals
      whereClause.ProposedProjectMember = {
        some: {
          studentId: user.id,
          status: ProposedProjectMemberStatusT.ACTIVE,
        },
      };
    } else if (user.userType === UserT.FACULTY) {
      // Faculty can see proposals they advise or based on role
      // TODO: Add role-based filtering
    }

    // Determine sort direction
    const orderDirection: Prisma.SortOrder = asc === 'asc' ? 'asc' : 'desc';

    // Build sort condition
    let orderByClause: any = { [orderBy]: orderDirection };

    // Sort by student or advisor name requires special handling
    if (orderBy === 'studentName' || orderBy === 'advisorName') {
      // Default to createdAt as these require complex joins
      orderByClause = { createdAt: orderDirection };
    }

    // Execute query
    const [data, total] = await Promise.all([
      this.prisma.proposedProject.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderByClause,
        include: {
          ProposedProjectMember: {
            where: {
              status: ProposedProjectMemberStatusT.ACTIVE,
            },
            include: {
              Student: {
                select: {
                  id: true,
                  fullName: true,
                  studentCode: true,
                  profilePicture: true,
                },
              },
              Faculty: {
                select: {
                  id: true,
                  fullName: true,
                  facultyCode: true,
                  profilePicture: true,
                },
              },
            },
          },
          ProposedProjectComments: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
            include: {
              CommenterStudent: {
                select: {
                  id: true,
                  fullName: true,
                  profilePicture: true,
                },
              },
              CommenterFaculty: {
                select: {
                  id: true,
                  fullName: true,
                  profilePicture: true,
                },
              },
            },
          },
          ProjectAllocation: true,
          FieldPool: true,
          ProposalOutline: {
            select: {
              id: true,
              status: true,
              updatedAt: true,
            },
          },
        },
      }),
      this.prisma.proposedProject.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  // Get details of a project proposal
  async findOne(id: string, user: AuthPayload): Promise<any> {
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          include: {
            Student: {
              select: {
                id: true,
                fullName: true,
                studentCode: true,
                profilePicture: true,
              },
            },
            Faculty: {
              select: {
                id: true,
                fullName: true,
                facultyCode: true,
                profilePicture: true,
              },
            },
          },
        },
        ProposedProjectComments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            CommenterStudent: {
              select: {
                id: true,
                fullName: true,
                profilePicture: true,
              },
            },
            CommenterFaculty: {
              select: {
                id: true,
                fullName: true,
                profilePicture: true,
              },
            },
          },
        },
        ProjectAllocation: true,
        FieldPool: true,
        ProposalOutline: true,
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // Check permission to view details
    const isMember = proposedProject.ProposedProjectMember.some(
      (member) => member.Student?.id === user.id,
    );

    const isAdvisor =
      user.userType === UserT.FACULTY &&
      proposedProject.ProposedProjectMember.some(
        (member) =>
          member.facultyId === user.id &&
          member.role === MEMBER_ROLES.ADVISOR &&
          member.status === ProposedProjectMemberStatusT.ACTIVE,
      );

    // TODO: Add checks for department head, faculty head roles

    if (!isMember && !isAdvisor && user.userType !== UserT.FACULTY) {
      throw new ForbiddenException(
        'No permission to view project proposal details',
      );
    }

    return proposedProject;
  }

  // Phương thức mới để cập nhật trạng thái
  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
    user: AuthPayload,
  ): Promise<any> {
    // Kiểm tra tồn tại
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          where: { status: ProposedProjectMemberStatusT.ACTIVE },
        },
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Không tìm thấy đề xuất dự án');
    }

    // Kiểm tra quyền thay đổi trạng thái
    const canChangeToStatus = await this.canUserChangeStatus(
      proposedProject,
      dto.status,
      user,
    );

    if (!canChangeToStatus) {
      throw new ForbiddenException(
        'Bạn không có quyền thay đổi sang trạng thái này',
      );
    }

    // Xử lý đặc biệt cho trạng thái APPROVED_BY_HEAD
    if (dto.status === ProposedProjectStatusT.APPROVED_BY_HEAD) {
      return this.approveAndCreateProject(id, dto, user);
    }

    // Cập nhật trạng thái
    const updated = await this.prisma.proposedProject.update({
      where: { id },
      data: { status: dto.status },
    });

    // Thêm comment nếu có
    if (dto.comment) {
      await this.prisma.proposedProjectComment.create({
        data: {
          proposedProjectId: id,
          content: dto.comment,
          commenterFacultyId:
            user.userType === UserT.FACULTY ? user.id : undefined,
          commenterStudentId:
            user.userType === UserT.STUDENT ? user.id : undefined,
        },
      });
    }

    return updated;
  }

  // Check if user has permission to change status
  private async canUserChangeStatus(
    project: any,
    newStatus: ProposedProjectStatusT,
    user: AuthPayload,
  ): Promise<boolean> {
    if (user.userType === UserT.STUDENT) {
      // Student can only change to PENDING_ADVISOR
      return (
        newStatus === ProposedProjectStatusT.TOPIC_SUBMISSION_PENDING &&
        this.isProjectMember(project, user.id)
      );
    }

    if (user.userType === UserT.FACULTY) {
      const isAdvisor = project.advisorId === user.id;

      // Check user role (simplified, needs full implementation)
      const userRoles = user.roles || [];
      const isHead = userRoles.includes('DEPARTMENT_HEAD');
      const isDean = userRoles.includes('DEAN');

      // Advisor can change to their status
      if (
        isAdvisor &&
        (newStatus === ProposedProjectStatusT.TOPIC_APPROVED ||
          newStatus === ProposedProjectStatusT.TOPIC_REQUESTED_CHANGES ||
          newStatus === ProposedProjectStatusT.OUTLINE_REJECTED)
      ) {
        return true;
      }

      // Department head can change to their status
      if (
        isHead &&
        (newStatus === ProposedProjectStatusT.PENDING_HEAD ||
          newStatus === ProposedProjectStatusT.REQUESTED_CHANGES_HEAD ||
          newStatus === ProposedProjectStatusT.REJECTED_BY_HEAD)
      ) {
        return true;
      }

      // Dean can approve the final status
      if (isDean && newStatus === ProposedProjectStatusT.APPROVED_BY_HEAD) {
        return true;
      }
    }

    return false;
  }

  // Check if user is a member of the proposal
  private isProjectMember(project: any, userId: string): boolean {
    return project.ProposedProjectMember.some(
      (member) => member.studentId === userId,
    );
  }

  // Handle approval and project creation
  private async approveAndCreateProject(
    id: string,
    dto: UpdateStatusDto,
    user: AuthPayload,
  ): Promise<any> {
    // Get project proposal information
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          where: { status: ProposedProjectMemberStatusT.ACTIVE },
          include: {
            Student: true,
            Faculty: true,
          },
        },
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Project proposal not found');
    }

    // 1. Update ProposedProject status
    const updatedProposedProject = await this.prisma.proposedProject.update({
      where: { id },
      data: {
        status: dto.status,
        approvedById: user.id,
        approvedAt: new Date(),
      },
    });

    // 2. Create official project
    const project = await this.prisma.project.create({
      data: {
        title: proposedProject.title,
        description: proposedProject.description,
        field: 'RESEARCH', // Or appropriate field
        type: ProjectT.GRADUATED,
        approvedById: user.id,
        departmentId: dto.departmentId,
      },
    });

    // 3. Create empty proposal outline
    const proposalOutline = await this.prisma.proposalOutline.create({
      data: {
        introduction: '',
        objectives: '',
        methodology: '',
        expectedResults: '',
        status: ProposalStatusT.DRAFT,
        projectId: project.id,
      },
    });

    // 4. Link proposal outline to project proposal
    await this.prisma.proposedProject.update({
      where: { id },
      data: {
        proposalOutlineId: proposalOutline.id,
      },
    });

    // 5. Create project members for students
    for (const member of proposedProject.ProposedProjectMember) {
      if (member.studentId) {
        await this.prisma.projectMember.create({
          data: {
            projectId: project.id,
            memberStudentId: member.studentId,
            role: member.role || MEMBER_ROLES.STUDENT,
            status: ProjectMemberStatusT.ACTIVE,
          },
        });
      }
    }

    // 6. Create project member for advisor
    const advisorMember = proposedProject.ProposedProjectMember.find(
      (member) => member.role === MEMBER_ROLES.ADVISOR && member.facultyId,
    );

    if (advisorMember?.facultyId) {
      await this.prisma.projectMember.create({
        data: {
          projectId: project.id,
          memberFacultyId: advisorMember.facultyId,
          role: MEMBER_ROLES.ADVISOR,
          status: ProjectMemberStatusT.ACTIVE,
        },
      });
    }

    // Add comment if provided
    if (dto.comment) {
      await this.prisma.proposedProjectComment.create({
        data: {
          proposedProjectId: id,
          content: dto.comment,
          commenterFacultyId: user.id,
        },
      });
    }

    return {
      proposedProject: updatedProposedProject,
      project,
      proposalOutline,
    };
  }

  /**
   * Update proposed project title
   * This method allows students to update the title of their proposal with status validation
   * If the proposal is already approved, title changes are not allowed - only outline submissions
   */
  async updateProposedProjectTitle(
    id: string,
    { title, description }: { title: string; description?: string },
    user: AuthPayload,
  ) {
    const proposedProject = await this.prisma.proposedProject.findUnique({
      where: { id },
      include: {
        ProposedProjectMember: {
          include: {
            Student: true,
          },
        },
      },
    });

    if (!proposedProject) {
      throw new NotFoundException('Proposed project not found');
    }

    // Check if user is a member of the project
    const isMember = proposedProject.ProposedProjectMember.some(
      (member) => member.Student?.id === user.id,
    );

    if (!isMember) {
      throw new ForbiddenException(
        'You are not authorized to update this project',
      );
    }

    // Check if the proposal is in a valid state for title update
    const allowedStatuses = [
      'TOPIC_SUBMISSION_PENDING',
      'TOPIC_REQUESTED_CHANGES',
    ];

    if (!allowedStatuses.includes(proposedProject.status)) {
      throw new BadRequestException(
        'Cannot update title for proposals that have already been approved or are in review',
      );
    }

    // Update the title
    const updatedProposedProject = await this.prisma.proposedProject.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return updatedProposedProject;
  }
}
