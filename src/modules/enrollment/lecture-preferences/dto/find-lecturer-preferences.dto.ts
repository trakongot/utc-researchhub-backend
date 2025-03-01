import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { lecturerPreferencesSchema } from '../schemas';

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
  })
  .partial();
export class FindLecturerPreferencesDto extends createZodDto(
  findLecturerPreferencesDtoSchema,
) {}
