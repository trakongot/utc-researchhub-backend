import { z } from 'zod';
import { lecturerSelectionSchema } from '../schema';

export const findLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    studyFieldId: true,
    lecturerId: true,
  })
  .extend({
    keyword: z.string(),
    orderBy: z.enum(['createdAt', 'updatedAt', 'position']),
    asc: z.enum(['asc', 'desc']),
    lecturerIds: z.array(z.string()),
    studyFieldIds: z.array(z.string()),
    page: z.number().min(1),
    limit: z.number().max(100),
    departmentId: z.string(),
  })
  .partial();

export type FindLecturerSelectionDto = z.infer<
  typeof findLecturerSelectionDtoSchema
>;
