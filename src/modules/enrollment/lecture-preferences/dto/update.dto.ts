import { z } from 'zod';
import { lecturerPreferencesSchema } from '../schema';

export const updateLecturerPreferencesDtoSchema = lecturerPreferencesSchema
  .pick({
    position: true,
    fieldId: true,
    topicTitle: true,
    description: true,
  })
  .partial();

export type UpdateLecturerPreferencesDto = z.infer<
  typeof updateLecturerPreferencesDtoSchema
>;
