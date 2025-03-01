import { createZodDto } from 'nestjs-zod';
import { lecturerPreferencesSchema } from '../schemas';

export const updateLecturerPreferencesDtoSchema = lecturerPreferencesSchema
  .pick({
    position: true,
    fieldId: true,
    topicTitle: true,
    description: true,
  })
  .partial();

export class UpdateLecturerPreferencesDto extends createZodDto(
  updateLecturerPreferencesDtoSchema,
) {}
