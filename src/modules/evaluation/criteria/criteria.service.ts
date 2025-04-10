import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

import { AuthPayload } from 'src/common/interface';
import {
  CreateEvaluationCriteriaDto,
  UpdateEvaluationCriteriaDto,
} from './schema';

@Injectable()
export class CriteriaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEvaluationCriteriaDto, requester: AuthPayload) {
    if (!requester.id) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    return this.prisma.evaluationCriteria.create({
      data: {
        ...dto,
        createdById: requester.id,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluationCriteria.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const criteria = await this.prisma.evaluationCriteria.findUnique({
      where: { id },
    });
    if (!criteria) {
      throw new NotFoundException(`Không tìm thấy tiêu chí với ID ${id}`);
    }
    return criteria;
  }

  async update(id: string, dto: UpdateEvaluationCriteriaDto) {
    await this.findOne(id);
    return this.prisma.evaluationCriteria.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const scoresUsingCriteria = await this.prisma.projectCriteriaScore.count({
      where: { criteriaId: id },
    });
    if (scoresUsingCriteria > 0) {
      throw new NotFoundException(
        `Không thể xóa tiêu chí ${id} vì đang được sử dụng để chấm điểm.`,
      );
    }
    return this.prisma.evaluationCriteria.delete({
      where: { id },
    });
  }
}
