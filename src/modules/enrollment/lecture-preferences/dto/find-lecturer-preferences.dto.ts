import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { lecturerPreferencesSchema } from '../schemas';

export const findLecturerPreferencesDtoSchema = lecturerPreferencesSchema
  .pick({
    fieldId: true,
    lecturerId: true,
  })
  .partial()
  .extend({
    keyword: z.string().optional(),
  });

export class FindLecturerPreferencesDto extends createZodDto(
  findLecturerPreferencesDtoSchema,
) {}
