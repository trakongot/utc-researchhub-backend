import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserT } from '@prisma/client';
import { AuthPayload } from 'src/common/interface';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import {
  CreateProjectCommentDto,
  FindProjectCommentDto,
  UpdateProjectCommentDto,
} from './schema';

@Injectable()
export class ProjectCommentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectCommentDto, user: AuthPayload): Promise<any> {
    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: {
        Members: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user has permission to comment
    // For simplicity, let's allow members of the project and faculty to comment
    let canComment = false;

    if (user.userType === UserT.STUDENT) {
      canComment = project.Members.some(
        (member) => member.memberStudentId === user.id,
      );
    } else if (user.userType === UserT.FACULTY) {
      // Faculty can be a direct member or have a special role (e.g., advisor, reviewer)
      canComment = project.Members.some(
        (member) => member.memberFacultyId === user.id,
      );

      // Allow Department Heads, Deans, etc. to comment as well
      // This is a placeholder - implement actual role checking
      const hasSpecialRole = true; // Replace with actual role check

      if (hasSpecialRole) {
        canComment = true;
      }
    }

    if (!canComment) {
      throw new ForbiddenException(
        'You do not have permission to comment on this project',
      );
    }

    // Create the comment
    const comment = await this.prisma.projectComment.create({
      data: {
        projectId: dto.projectId,
        content: dto.content,
        commenterStudentId:
          user.userType === UserT.STUDENT ? user.id : undefined,
        commenterFacultyId:
          user.userType === UserT.FACULTY ? user.id : undefined,
      },
    });

    return comment;
  }

  async find(dto: FindProjectCommentDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      projectId,
      orderBy = 'createdAt',
      asc = 'desc',
    } = dto;

    // Determine sort order
    const orderDirection: Prisma.SortOrder = asc === 'asc' ? 'asc' : 'desc';
    const orderByOptions: Prisma.ProjectCommentOrderByWithRelationInput = {
      [orderBy]: orderDirection,
    };

    // Execute queries to get data and count
    const data = await this.prisma.projectComment.findMany({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderByOptions,
      include: {
        CommenterStudent: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
            profilePicture: true,
          },
        },
        CommenterFaculty: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            profilePicture: true,
          },
        },
        Project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const total = await this.prisma.projectComment.count({
      where: { projectId },
    });

    // Calculate pagination details
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

  async findOne(id: string) {
    const comment = await this.prisma.projectComment.findUnique({
      where: { id },
      include: {
        CommenterStudent: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
            profilePicture: true,
          },
        },
        CommenterFaculty: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, dto: UpdateProjectCommentDto, user: AuthPayload) {
    const comment = await this.prisma.projectComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the comment owner
    const isOwner =
      (user.userType === UserT.STUDENT &&
        comment.commenterStudentId === user.id) ||
      (user.userType === UserT.FACULTY &&
        comment.commenterFacultyId === user.id);

    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to update this comment',
      );
    }

    // Update comment
    const updatedComment = await this.prisma.projectComment.update({
      where: { id },
      data: { content: dto.content },
    });

    return updatedComment;
  }

  async remove(id: string, user: AuthPayload) {
    const comment = await this.prisma.projectComment.findUnique({
      where: { id },
      include: {
        Project: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the comment owner, the project owner, or has admin privileges
    const isCommentOwner =
      (user.userType === UserT.STUDENT &&
        comment.commenterStudentId === user.id) ||
      (user.userType === UserT.FACULTY &&
        comment.commenterFacultyId === user.id);

    // Check if faculty is project advisor or has special role
    let hasSpecialRights = false;
    if (user.userType === UserT.FACULTY) {
      if (comment.Project.approvedById === user.id) {
        hasSpecialRights = true;
      }

      // Department Head, Dean, etc. can delete comments
      // This is a placeholder - implement actual role checking
      const hasAdminRole = true; // Replace with actual role check

      if (hasAdminRole) {
        hasSpecialRights = true;
      }
    }

    if (!isCommentOwner && !hasSpecialRights) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    // Delete comment
    await this.prisma.projectComment.delete({
      where: { id },
    });

    return { message: 'Comment has been deleted successfully' };
  }
}
