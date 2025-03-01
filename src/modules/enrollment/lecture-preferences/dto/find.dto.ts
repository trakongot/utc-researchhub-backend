import { z } from 'zod';
import { lecturerPreferencesSchema } from '../schema';

export const findLecturerPreferencesDtoSchema = lecturerPreferencesSchema
  .pick({
    fieldId: true,
    lecturerId: true,
  })
  .extend({
    keyword: z.string(),
    orderBy: z.enum(['createdAt', 'updatedAt', 'position']),
    asc: z.enum(['asc', 'desc']),
    lecturerIds: z.array(z.string()),
    fieldIds: z.array(z.string()),
    lastId: z.string(),
    page: z.number().min(1),
    limit: z.number().max(100),
    departmentId: z.string(),
  })
  .partial();

export type FindLecturerPreferencesDto = z.infer<
  typeof findLecturerPreferencesDtoSchema
>;
