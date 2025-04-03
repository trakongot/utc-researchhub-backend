import { stringToNumber } from 'src/common/filters/zod-utils';
import { z } from 'zod';

export const EvaluationCriteriaSchema = z.object({
  name: z.string().min(1, 'Tên tiêu chí không được để trống'),
  description: z.string().optional(),
  weight: z.number().min(0).max(1).default(1.0),
  createdById: z.string().uuid('ID giảng viên tạo không hợp lệ'),
});

export const EvaluationCriteriaQuerySchema = z.object({
  page: stringToNumber('Số trang không hợp lệ').default('1'),
  limit: stringToNumber('Số lượng mục không hợp lệ').default('10'),
  name: z.string().optional(),
});

export type EvaluationCriteriaDto = z.infer<typeof EvaluationCriteriaSchema>;
export type EvaluationCriteriaQueryDto = z.infer<
  typeof EvaluationCriteriaQuerySchema
>;
