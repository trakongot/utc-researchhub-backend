import { z } from 'zod';
import { lecturerPreferencesSchema } from '../schema';

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
export type CreateLecturerPreferencesDto = z.infer<
  typeof createLecturerPreferencesDtoSchema
>;
