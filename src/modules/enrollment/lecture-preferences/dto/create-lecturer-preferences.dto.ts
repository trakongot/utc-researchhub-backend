import { createZodDto } from 'nestjs-zod';
import { lecturerPreferencesSchema } from '../schemas';

export const createLecturerPreferencesDtoSchema = lecturerPreferencesSchema
  .pick({
    position: true,
    fieldId: true,
    topicTitle: true,
    description: true,
    lecturerId: true,
  })
  .required({
    position: true,
    fieldId: true,
    topicTitle: true,
    lecturerId: true,
  });

export class CreateLecturerPreferencesDto extends createZodDto(
  createLecturerPreferencesDtoSchema,
) {}
