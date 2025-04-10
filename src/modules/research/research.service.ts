import { Injectable } from '@nestjs/common';
import { ProjectT, UserT } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class ResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistics() {
    const projects = await this.prisma.project.count();
    const facultyCount = await this.prisma.faculty.count({
      where: { status: 'ACTIVE' },
    });
    const studentCount = await this.prisma.student.count({
      where: { status: 'ACTIVE' },
    });
    const researchProjects = await this.prisma.project.count({
      where: { type: ProjectT.RESEARCH },
    });
    const graduatedProjects = await this.prisma.project.count({
      where: { type: ProjectT.GRADUATED },
    });
    const collaborationProjects = await this.prisma.project.count({
      where: { type: ProjectT.COLLABORATION },
    });
    const competitionProjects = await this.prisma.project.count({
      where: { type: ProjectT.COMPETITION },
    });

    return {
      totalProjects: projects,
      activeFaculty: facultyCount,
      activeStudents: studentCount,
      researchProjects,
      graduatedProjects,
      collaborationProjects,
      competitionProjects,
    };
  }

  async getResearchByDepartment() {
    // Query to get counts of research projects by department
    const departments = await this.prisma.department.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            Project: {
              where: { type: ProjectT.RESEARCH },
            },
          },
        },
      },
    });

    return departments.map((dept) => ({
      departmentId: dept.id,
      departmentName: dept.name,
      projectCount: dept._count.Project,
    }));
  }

  async addProjectComment(
    projectId: string,
    commenterId: string,
    role: UserT,
    content: string,
  ) {
    return this.prisma.projectComment.create({
      data: {
        id: crypto.randomUUID(),
        content,
        projectId,
        commenterId,
        role,
      },
    });
  }

  async getProjectComments(projectId: string) {
    return this.prisma.projectComment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        Student: {
          select: {
            fullName: true,
            studentCode: true,
            profilePicture: true,
          },
        },
        Faculty: {
          select: {
            fullName: true,
            facultyCode: true,
            profilePicture: true,
            FacultyRole: true,
          },
        },
      },
    });
  }

  async searchProjects(query: string, type?: ProjectT, departmentId?: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        ...(type && { type }),
        ...(departmentId && { departmentId }),
      },
      include: {
        Department: {
          select: {
            name: true,
          },
        },
        Members: {
          include: {
            Project: true,
          },
        },
      },
      take: 20,
    });
  }
}
