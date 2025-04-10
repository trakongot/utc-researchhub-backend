import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from '../../../common/modules/prisma/prisma.service';
import { CreateStudentDto, FindStudentDto, UpdateStudentDto } from './schema';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    // Check for existing student with same code
    const existing = await this.prisma.student.findUnique({
      where: { studentCode: dto.studentCode },
    });
    if (existing) {
      throw new BadRequestException('Sinh viên với mã số này đã tồn tại.');
    }

    const id = uuidv7();
    const student = await this.prisma.student.create({
      data: {
        id,
        ...dto,
      },
      include: {
        Department: true,
      },
    });

    return student;
  }

  async get(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
        profilePicture: true,
        fullName: true,
        studentCode: true,
        Department: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy sinh viên với ID này.');
    }

    return student;
  }

  async find(dto: FindStudentDto) {
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
          Department: true,
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
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy sinh viên với ID này.');
    }

    // Check for duplicate code if updating studentCode
    if (dto.studentCode && dto.studentCode !== student.studentCode) {
      const duplicate = await this.prisma.student.findUnique({
        where: { studentCode: dto.studentCode },
      });

      if (duplicate) {
        throw new BadRequestException(
          'Mã sinh viên đã tồn tại trong hệ thống.',
        );
      }
    }

    const updated = await this.prisma.student.update({
      where: { id },
      data: { ...dto },
      include: {
        Department: true,
      },
    });

    return updated;
  }

  async delete(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy sinh viên với ID này.');
    }

    await this.prisma.student.delete({ where: { id } });

    return null;
  }

  async authenticate(code: string, password: string) {
    const user = await this.prisma.student.findUnique({
      where: { studentCode: code },
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
        profilePicture: true,
        fullName: true,
        studentCode: true,
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

    const updated = await this.prisma.student.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });

    return updated;
  }
}
