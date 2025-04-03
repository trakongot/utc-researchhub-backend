import { Injectable, NotFoundException } from '@nestjs/common';
import { generateApiResponse } from 'src/common/responses';
import { PrismaService } from 'src/config/database';
import {
  EvaluationCriteriaDto,
  EvaluationCriteriaQueryDto,
} from './evaluation-criteria.dto';

@Injectable()
export class EvaluationCriteriaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: EvaluationCriteriaDto) {
    const criteria = await this.prisma.evaluationCriteria.create({
      data: {
        id: crypto.randomUUID(),
        name: dto.name,
        description: dto.description,
        weight: dto.weight,
        createdById: dto.createdById,
      },
      include: {
        CreatedByFaculty: true,
      },
    });

    return generateApiResponse('Tạo tiêu chí đánh giá thành công', criteria);
  }

  async findAll(query: EvaluationCriteriaQueryDto) {
    const { page, limit, name } = query;
    const skip = (page - 1) * limit;

    const [total, criteria] = await Promise.all([
      this.prisma.evaluationCriteria.count({
        where: {
          name: name ? { contains: name } : undefined,
        },
      }),
      this.prisma.evaluationCriteria.findMany({
        where: {
          name: name ? { contains: name } : undefined,
        },
        include: {
          CreatedByFaculty: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return generateApiResponse('Lấy danh sách tiêu chí đánh giá thành công', {
      items: criteria,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async findOne(id: string) {
    const criteria = await this.prisma.evaluationCriteria.findUnique({
      where: { id },
      include: {
        CreatedByFaculty: true,
        ProjectCriteriaScore: {
          include: {
            ProjectEvaluation: true,
            Evaluator: true,
          },
        },
      },
    });

    if (!criteria) {
      throw new NotFoundException('Không tìm thấy tiêu chí đánh giá');
    }

    return generateApiResponse(
      'Lấy thông tin tiêu chí đánh giá thành công',
      criteria,
    );
  }

  async update(id: string, dto: EvaluationCriteriaDto) {
    const criteria = await this.prisma.evaluationCriteria.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        weight: dto.weight,
      },
      include: {
        CreatedByFaculty: true,
      },
    });

    return generateApiResponse(
      'Cập nhật tiêu chí đánh giá thành công',
      criteria,
    );
  }

  async remove(id: string) {
    await this.prisma.evaluationCriteria.delete({
      where: { id },
    });

    return generateApiResponse('Xóa tiêu chí đánh giá thành công', null);
  }
}
