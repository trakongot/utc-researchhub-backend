import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FacultyRoleT, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { generateApiResponse } from 'src/common/response';
import { uuidv7 } from 'uuidv7';
import { CreateFacultyDto, FindFacultyDto, UpdateFacultyDto } from './schema';
@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFacultyDto) {
    const id = uuidv7();
    const { roles, ...facultyData } = dto;

    // Check for existing faculty with same code
    const existing = await this.prisma.faculty.findUnique({
      where: { facultyCode: facultyData.facultyCode },
    });
    if (existing) {
      throw new BadRequestException('Giảng viên với mã số này đã tồn tại.');
    }

    const faculty = await this.prisma.$transaction(async (tx) => {
      const faculty = await tx.faculty.create({
        data: {
          id,
          ...facultyData,
        },
        include: {
          Department: true,
          FacultyRole: true,
        },
      });

      if (roles && roles.length > 0) {
        await Promise.all(
          roles.map((role) =>
            tx.facultyRole.create({
              data: {
                id: uuidv7(),
                facultyId: faculty.id,
                role: role as FacultyRoleT,
              },
            }),
          ),
        );
      }

      return tx.faculty.findUnique({
        where: { id: faculty.id },
        include: {
          Department: true,
          FacultyRole: true,
        },
      });
    });

    return faculty;
  }

  async get(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
        profilePicture: true,
        fullName: true,
        facultyCode: true,
        Department: true,
        FacultyRole: true,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
    }

    return faculty;
  }

  async find(dto: FindFacultyDto) {
    let whereClause: Prisma.FacultyWhereInput = {
      ...(dto.facultyCode && {
        facultyCode: {
          contains: dto.facultyCode,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(dto.fullName && {
        fullName: {
          contains: dto.fullName,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(dto.email && {
        email: { contains: dto.email, mode: Prisma.QueryMode.insensitive },
      }),
      ...(dto.departmentId && {
        departmentId: dto.departmentId,
      }),
      ...(dto.status && {
        status: dto.status,
      }),
    };

    // Add role filter if provided
    if (dto.role) {
      const facultyRoles = await this.prisma.facultyRole.findMany({
        where: { role: dto.role },
        select: { facultyId: true },
      });

      const facultyIds = facultyRoles.map((fr) => fr.facultyId);

      whereClause = {
        ...whereClause,
        id: { in: facultyIds },
      };
    }

    const skip = (dto.page - 1) * dto.limit;
    const orderByField = dto.orderBy || 'createdAt';
    const orderDirection = dto.asc === 'asc' ? 'asc' : 'desc';

    const orderBy: Prisma.FacultyOrderByWithRelationInput = {
      [orderByField]: orderDirection,
    };

    const [data, total] = await Promise.all([
      this.prisma.faculty.findMany({
        where: whereClause,
        include: {
          Department: true,
          FacultyRole: true,
        },
        skip,
        take: dto.limit,
        orderBy,
      }),
      this.prisma.faculty.count({ where: whereClause }),
    ]);

    return {
      data,
      paging: { page: dto.page, limit: dto.limit },
      total,
    };
  }

  async update(id: string, dto: UpdateFacultyDto) {
    const existingFaculty = await this.prisma.faculty.findUnique({
      where: { id },
    });

    if (!existingFaculty) {
      throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
    }

    // Check for duplicate code if updating facultyCode
    if (dto.facultyCode && dto.facultyCode !== existingFaculty.facultyCode) {
      const duplicate = await this.prisma.faculty.findUnique({
        where: { facultyCode: dto.facultyCode },
      });

      if (duplicate) {
        throw new BadRequestException(
          'Mã giảng viên đã tồn tại trong hệ thống.',
        );
      }
    }

    const updated = await this.prisma.faculty.update({
      where: { id },
      data: { ...dto },
      include: {
        Department: true,
        FacultyRole: true,
      },
    });

    return updated;
  }

  async delete(id: string) {
    const existingFaculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        FacultyRole: true,
      },
    });

    if (!existingFaculty) {
      throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
    }

    // Delete in a transaction to handle roles
    await this.prisma.$transaction(async (tx) => {
      // Delete faculty roles first
      if (existingFaculty.FacultyRole.length > 0) {
        await tx.facultyRole.deleteMany({
          where: {
            facultyId: id,
          },
        });
      }

      // Delete faculty
      await tx.faculty.delete({ where: { id } });
    });
    return null;
  }

  async addRole(facultyId: string, role: string) {
    const existingFaculty = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!existingFaculty) {
      throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
    }

    const existingRole = await this.prisma.facultyRole.findFirst({
      where: {
        facultyId,
        role: role as any,
      },
    });

    if (existingRole) {
      throw new BadRequestException('Giảng viên đã có vai trò này.');
    }

    await this.prisma.facultyRole.create({
      data: {
        id: uuidv7(),
        facultyId,
        role: role as FacultyRoleT,
      },
    });

    const updated = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        Department: true,
        FacultyRole: true,
      },
    });

    return generateApiResponse('Thêm vai trò thành công', updated);
  }

  async removeRole(facultyId: string, role: string) {
    // Check if faculty exists
    const existingFaculty = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!existingFaculty) {
      throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
    }

    // Find the role to delete
    const roleToDelete = await this.prisma.facultyRole.findFirst({
      where: {
        facultyId,
        role: role as any,
      },
    });

    if (!roleToDelete) {
      throw new BadRequestException('Giảng viên không có vai trò này.');
    }

    // Delete the role
    await this.prisma.facultyRole.delete({
      where: { id: roleToDelete.id },
    });

    // Return updated faculty
    const updated = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        Department: true,
        FacultyRole: true,
      },
    });

    return updated;
  }

  async authenticate(code: string, password: string) {
    const user = await this.prisma.faculty.findUnique({
      where: { facultyCode: code },
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
        profilePicture: true,
        fullName: true,
        facultyCode: true,
        FacultyRole: { select: { role: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại hoặc đã bị khóa');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    return user;
  }
  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const updated = await this.prisma.faculty.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
    return updated;
  }
}
