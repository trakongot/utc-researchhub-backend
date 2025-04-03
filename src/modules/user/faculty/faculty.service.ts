import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/database';
import { uuidv7 } from 'uuidv7';
import { CreateFacultyDto, FindFacultyDto, UpdateFacultyDto, CreateFacultyRoleDto } from './faculty.dto';


@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFacultyDto) {
    try {
      const id = uuidv7();
      const { roles, ...facultyData } = dto;

      // Create faculty in a transaction to handle roles
      return this.prisma.$transaction(async (tx) => {
        // Create the faculty record
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

        // Create faculty roles if provided
        if (roles && roles.length > 0) {
          await Promise.all(
            roles.map((role) =>
              tx.facultyRole.create({
                data: {
                  id: uuidv7(),
                  facultyId: faculty.id,
                  role,
                },
              }),
            ),
          );
        }

        // Return faculty with updated roles
        return tx.faculty.findUnique({
          where: { id: faculty.id },
          include: {
            Department: true,
            FacultyRole: true,
          },
        });
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Giảng viên với mã số này đã tồn tại.');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Khoa/bộ môn không tồn tại. Vui lòng kiểm tra lại thông tin.',
        );
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi tạo giảng viên. Vui lòng thử lại sau.',
      );
    }
  }

  async get(id: string) {
    try {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id },
        include: {
          Department: true,
          FacultyRole: true,
        },
      });

      if (!faculty) {
        throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
      }

      return faculty;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi tìm kiếm giảng viên. Vui lòng thử lại sau.',
      );
    }
  }

  async find(dto: FindFacultyDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi tìm kiếm danh sách giảng viên. Vui lòng thử lại sau.',
      );
    }
  }

  async update(id: string, dto: UpdateFacultyDto) {
    try {
      const existingFaculty = await this.prisma.faculty.findUnique({
        where: { id },
      });

      if (!existingFaculty) {
        throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
      }

      return this.prisma.faculty.update({
        where: { id },
        data: { ...dto },
        include: {
          Department: true,
          FacultyRole: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Thông tin cập nhật trùng lặp với giảng viên khác.',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Khoa/bộ môn không tồn tại. Vui lòng kiểm tra lại thông tin.',
        );
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi cập nhật giảng viên. Vui lòng thử lại sau.',
      );
    }
  }

  async delete(id: string) {
    try {
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
      return this.prisma.$transaction(async (tx) => {
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi xóa giảng viên. Vui lòng thử lại sau.',
      );
    }
  }

  async addRole(dto: CreateFacultyRoleDto) {
    try {
      const { facultyId, role } = dto;

      // Check if faculty exists
      const existingFaculty = await this.prisma.faculty.findUnique({
        where: { id: facultyId },
      });

      if (!existingFaculty) {
        throw new NotFoundException('Không tìm thấy giảng viên với ID này.');
      }

      // Check if role already exists
      const existingRole = await this.prisma.facultyRole.findFirst({
        where: {
          facultyId,
          role,
        },
      });

      if (existingRole) {
        throw new BadRequestException('Giảng viên đã có vai trò này.');
      }

      // Create new role
      await this.prisma.facultyRole.create({
        data: {
          id: uuidv7(),
          facultyId,
          role,
        },
      });

      // Return updated faculty
      return this.get(facultyId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi thêm vai trò cho giảng viên. Vui lòng thử lại sau.',
      );
    }
  }

  async removeRole(facultyId: string, role: string) {
    try {
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
      return this.get(facultyId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi xóa vai trò của giảng viên. Vui lòng thử lại sau.',
      );
    }
  }
}
