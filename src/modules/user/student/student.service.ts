import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/database';
import { uuidv7 } from 'uuidv7';
import {
  CreateStudentDto,
  FindStudentDto,
  UpdateStudentDto,
} from './student.dto.ts';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    try {
      const id = uuidv7();
      return this.prisma.student.create({
        data: {
          id,
          ...dto,
        },
        include: {
          department: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Sinh viên với mã số này đã tồn tại.');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Khoa/ngành không tồn tại. Vui lòng kiểm tra lại thông tin.',
        );
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi tạo sinh viên. Vui lòng thử lại sau.',
      );
    }
  }

  async get(id: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: {
          department: true,
        },
      });

      if (!student) {
        throw new NotFoundException('Không tìm thấy sinh viên với ID này.');
      }

      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi tìm kiếm sinh viên. Vui lòng thử lại sau.',
      );
    }
  }

  async find(dto: FindStudentDto) {
    try {
      const whereClause: Prisma.StudentWhereInput = {
        ...(dto.studentCode && {
          studentCode: {
            contains: dto.studentCode,
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
        ...(dto.majorCode && {
          majorCode: {
            contains: dto.majorCode,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const skip = (dto.page - 1) * dto.limit;
      const orderByField = dto.orderBy || 'createdAt';
      const orderDirection = dto.asc === 'asc' ? 'asc' : 'desc';

      const orderBy: Prisma.StudentOrderByWithRelationInput = {
        [orderByField]: orderDirection,
      };

      const [data, total] = await Promise.all([
        this.prisma.student.findMany({
          where: whereClause,
          include: {
            department: true,
          },
          skip,
          take: dto.limit,
          orderBy,
        }),
        this.prisma.student.count({ where: whereClause }),
      ]);

      return {
        data,
        paging: { page: dto.page, limit: dto.limit },
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi tìm kiếm danh sách sinh viên. Vui lòng thử lại sau.',
      );
    }
  }

  async update(id: string, dto: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
      });

      if (!student) {
        throw new NotFoundException('Không tìm thấy sinh viên với ID này.');
      }

      return this.prisma.student.update({
        where: { id },
        data: { ...dto },
        include: {
          department: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Thông tin cập nhật trùng lặp với sinh viên khác.',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Khoa/ngành không tồn tại. Vui lòng kiểm tra lại thông tin.',
        );
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi cập nhật sinh viên. Vui lòng thử lại sau.',
      );
    }
  }

  async delete(id: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
      });

      if (!student) {
        throw new NotFoundException('Không tìm thấy sinh viên với ID này.');
      }

      await this.prisma.student.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi xóa sinh viên. Vui lòng thử lại sau.',
      );
    }
  }
}
