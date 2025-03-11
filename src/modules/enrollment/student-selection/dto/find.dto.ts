import { z } from 'zod';
import { studentSelectionSchema } from '../schema';

export const findStudentSelectionDtoSchema = studentSelectionSchema
  .pick({
    studentId: true,
    facultyMemberId: true,
    fieldId: true,
  })
  .extend({
    keyword: z.string(),
    orderBy: z.enum(['createdAt', 'updatedAt']),
    asc: z.enum(['asc', 'desc']),
    lastId: z.string(),
    page: z.number().min(1),
    limit: z.number().max(100),
    departmentId: z.string(),
  })
  .partial();

export type FindStudentSelectionDto = z.infer<
  typeof findStudentSelectionDtoSchema
>;
