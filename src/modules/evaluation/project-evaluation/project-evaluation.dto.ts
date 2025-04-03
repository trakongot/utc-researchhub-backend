import { stringToNumber } from 'src/common/filters/zod-utils';
import { z } from 'zod';

export const ProjectEvaluationStatusT = z.enum(
  ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
  {
    errorMap: () => ({ message: 'Trạng thái không hợp lệ' }),
  },
);

export const ProjectEvaluationSchema = z.object({
  projectId: z.string().uuid('ID dự án không hợp lệ'),
  status: ProjectEvaluationStatusT,
  evaluatedById: z
    .string()
    .uuid('ID giảng viên đánh giá không hợp lệ')
    .optional(),
  teacherScore: z.number().min(0).max(10).optional(),
  committeeAverageScore: z.number().min(0).max(10).optional(),
  teacherWeight: z.number().min(0).max(1).default(0.5),
  committeeWeight: z.number().min(0).max(1).default(0.5),
});

export const ProjectEvaluationScoreSchema = z.object({
  role: z.enum(['CHAIRMAN', 'SECRETARY', 'MEMBER']),
  score: z.number().min(0).max(10),
  comment: z.string().optional(),
  committeeMemberId: z.string().uuid('ID thành viên hội đồng không hợp lệ'),
});

export const ProjectEvaluationQuerySchema = z.object({
  page: stringToNumber('Số trang không hợp lệ').default('1'),
  limit: stringToNumber('Số lượng mục không hợp lệ').default('10'),
  status: ProjectEvaluationStatusT.optional(),
  projectId: z.string().uuid('ID dự án không hợp lệ').optional(),
});

export type ProjectEvaluationDto = z.infer<typeof ProjectEvaluationSchema>;
export type ProjectEvaluationScoreDto = z.infer<
  typeof ProjectEvaluationScoreSchema
>;
export type ProjectEvaluationQueryDto = z.infer<
  typeof ProjectEvaluationQuerySchema
>;
