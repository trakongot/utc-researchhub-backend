import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { CreateStudentSelectionDto } from './dto/create.dto';
import { FindStudentSelectionDto } from './dto/find.dto';
import { UpdateStudentSelectionDto } from './dto/update.dto';

@Injectable()
export class StudentSelectionService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const studentAdvisingPreference =
      await this.prisma.studentSelection.findUnique({
        where: { id },
        include: {
          FieldPool: {
            select: {
              name: true,
              id: true,
            },
          },
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

    if (!studentAdvisingPreference) {
      throw new NotFoundException(
        `Không tìm thấy advising preference với ID: ${id}`,
      );
    }
    return studentAdvisingPreference;
  }

  async find(dto: FindStudentSelectionDto, page: number, limit: number) {
    const whereClause: Prisma.StudentSelectionWhereInput = {
      ...(dto.studentId ? { studentId: dto.studentId } : {}),
      ...(dto.facultyMemberId ? { facultyMemberId: dto.facultyMemberId } : {}),
      ...(dto.fieldId ? { studyFieldId: dto.fieldId } : {}),
      ...(dto.departmentId
        ? { student: { departmentId: dto.departmentId } }
        : {}),
      ...(dto.keyword && {
        student: { fullName: { contains: dto.keyword, mode: 'insensitive' } },
      }),
    };
    const orderBy = [
      { [dto.orderBy || 'preferredAt']: dto.asc === 'asc' ? 'asc' : 'desc' },
    ];
    const pagination: { skip: number; cursor?: { id: string } } = dto.lastId
      ? { cursor: { id: dto.lastId }, skip: 1 }
      : { skip: (page - 1) * limit };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.studentSelection.findMany({
        where: whereClause,
        select: {
          id: true,
          studentId: true,
          preferredAt: true,
          createdAt: true,
          updatedAt: true,
          FieldPool: {
            select: {
              name: true,
              id: true,
            },
          },

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
        take: limit,
        ...pagination,
        orderBy,
      }),
      this.prisma.studentSelection.count({ where: whereClause }),
    ]);

    return { data, paging: { page, limit }, total };
  }

  async create(dto: CreateStudentSelectionDto) {
    const id = uuidv7();

    return this.prisma.studentSelection.create({
      data: {
        id,
        ...dto,
        preferredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateStudentSelectionDto) {
    const existingPreference = await this.prisma.studentSelection.findUnique({
      where: { id },
    });
    if (!existingPreference) {
      throw new NotFoundException(
        `Không tìm thấy advising preference với ID: ${id}`,
      );
    }

    return this.prisma.studentSelection.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async delete(id: string) {
    const existingPreference = await this.prisma.studentSelection.findUnique({
      where: { id },
    });
    if (!existingPreference) {
      throw new NotFoundException(
        `Không tìm thấy advising preference với ID: ${id}`,
      );
    }

    await this.prisma.studentSelection.delete({ where: { id } });
  }
}
