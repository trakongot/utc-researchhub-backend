import { Injectable, NotFoundException } from '@nestjs/common';
import { generateApiResponse } from 'src/common/responses';
import { PrismaService } from 'src/config/database';
import {
  ProjectEvaluationDto,
  ProjectEvaluationQueryDto,
  ProjectEvaluationScoreDto,
} from './project-evaluation.dto';

@Injectable()
export class ProjectEvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: ProjectEvaluationDto) {
    const evaluation = await this.prisma.projectEvaluation.create({
      data: {
        id: crypto.randomUUID(),
        ProjectId: dto.projectId,
        status: dto.status,
        evaluatedById: dto.evaluatedById,
        teacherScore: dto.teacherScore,
        committeeAverageScore: dto.committeeAverageScore,
        teacherWeight: dto.teacherWeight,
        committeeWeight: dto.committeeWeight,
      },
      include: {
        Project: true,
        EvaluatedByFaculty: true,
      },
    });

    return generateApiResponse('Tạo đánh giá dự án thành công', evaluation);
  }

  async findAll(query: ProjectEvaluationQueryDto) {
    const { page, limit, status, projectId } = query;
    const skip = (page - 1) * limit;

    const [total, evaluations] = await Promise.all([
      this.prisma.projectEvaluation.count({
        where: {
          status,
          ProjectId: projectId,
        },
      }),
      this.prisma.projectEvaluation.findMany({
        where: {
          status,
          ProjectId: projectId,
        },
        include: {
          Project: true,
          EvaluatedByFaculty: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return generateApiResponse('Lấy danh sách đánh giá dự án thành công', {
      items: evaluations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async findOne(id: string) {
    const evaluation = await this.prisma.projectEvaluation.findUnique({
      where: { id },
      include: {
        Project: true,
        EvaluatedByFaculty: true,
        Score: {
          include: {
            CommitteeMember: true,
          },
        },
        CriteriaScores: {
          include: {
            EvaluationCriteria: true,
            Evaluator: true,
          },
        },
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Không tìm thấy đánh giá dự án');
    }

    return generateApiResponse(
      'Lấy thông tin đánh giá dự án thành công',
      evaluation,
    );
  }

  async update(id: string, dto: ProjectEvaluationDto) {
    const evaluation = await this.prisma.projectEvaluation.update({
      where: { id },
      data: {
        status: dto.status,
        evaluatedById: dto.evaluatedById,
        teacherScore: dto.teacherScore,
        committeeAverageScore: dto.committeeAverageScore,
        teacherWeight: dto.teacherWeight,
        committeeWeight: dto.committeeWeight,
      },
      include: {
        Project: true,
        EvaluatedByFaculty: true,
      },
    });

    return generateApiResponse(
      'Cập nhật đánh giá dự án thành công',
      evaluation,
    );
  }

  async addScore(id: string, dto: ProjectEvaluationScoreDto) {
    const score = await this.prisma.projectEvaluationScore.create({
      data: {
        id: crypto.randomUUID(),
        ProjectEvaluationId: id,
        role: dto.role,
        score: dto.score,
        comment: dto.comment,
        committeeMemberId: dto.committeeMemberId,
      },
      include: {
        CommitteeMember: true,
      },
    });

    return generateApiResponse('Thêm điểm đánh giá thành công', score);
  }

  async remove(id: string) {
    await this.prisma.projectEvaluation.delete({
      where: { id },
    });

    return generateApiResponse('Xóa đánh giá dự án thành công', null);
  }
}
