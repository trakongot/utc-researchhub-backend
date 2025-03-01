import { number, z } from 'zod';
import { graduationProjectAllocationsSchema } from '../schema';

export const findGraduationProjectAllocationsDtoSchema =
  graduationProjectAllocationsSchema
    .pick({
      studentId: true,
      lecturerId: true,
      topicTitle: true,
    })
    .extend({
      allocatedAtStart: z.date().optional(),
      allocatedAtEnd: z.date().optional(),
      createdAtStart: z.date().optional(),
      createdAtEnd: z.date().optional(),
      updatedAtStart: z.date().optional(),
      updatedAtEnd: z.date().optional(),
      orderBy: z.enum(['allocatedAt', 'createdAt', 'updatedAt']).optional(),
      asc: z.enum(['asc', 'desc']).optional(),
      lastId: z.string().optional(),
      departmentId: z.string().optional(),
      page: number().min(1),
      limit: number().max(100),
    })
    .partial();

export type FindGraduationProjectAllocationsDto = z.infer<
  typeof findGraduationProjectAllocationsDtoSchema
>;
