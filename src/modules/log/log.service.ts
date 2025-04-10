import { Injectable } from '@nestjs/common';
import { UserT } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: {
    entityType: string;
    entityId?: string;
    action: string;
    oldValue?: string;
    newValue?: string;
    metadata?: Record<string, any> | string;
    userId: string;
    userType: UserT;
    departmentId?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        id: crypto.randomUUID(),
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        oldValue: data.oldValue,
        newValue: data.newValue,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
        userId: data.userId,
        userType: data.userType,
        departmentId: data.departmentId,
      },
    });
  }

  async getLogsByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        CreatedByStudent: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
          },
        },
        CreatedByFaculty: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            FacultyRole: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getLogsByUser(userId: string, userType: UserT) {
    return this.prisma.auditLog.findMany({
      where: {
        userId,
        userType,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getLogsByDepartment(departmentId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        departmentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        CreatedByStudent: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
          },
        },
        CreatedByFaculty: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            FacultyRole: true,
          },
        },
      },
    });
  }

  async searchLogs(
    query: string,
    startDate?: Date,
    endDate?: Date,
    entityType?: string,
    action?: string,
  ) {
    const where: any = {
      OR: [
        { entityId: { contains: query, mode: 'insensitive' } },
        { oldValue: { contains: query, mode: 'insensitive' } },
        { newValue: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      where.createdAt = {
        gte: startDate,
      };
    } else if (endDate) {
      where.createdAt = {
        lte: endDate,
      };
    }

    if (entityType) {
      where.entityType = entityType;
    }

    if (action) {
      where.action = action;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        CreatedByStudent: {
          select: {
            id: true,
            fullName: true,
            studentCode: true,
          },
        },
        CreatedByFaculty: {
          select: {
            id: true,
            fullName: true,
            facultyCode: true,
            FacultyRole: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 100,
    });
  }
}
