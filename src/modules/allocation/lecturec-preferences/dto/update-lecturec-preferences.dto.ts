import { z } from 'zod';
import { lecturecPreferencesSchema } from '../schemas';

export const updateLecturecPreferencesDtoSchema = lecturecPreferencesSchema
  .pick({
    position: true,
    field: true,
    subField: true,
    topicTitle: true,
    description: true,
  })
  .partial();

export type UpdateLecturecPreferencesDto = z.infer<
  typeof updateLecturecPreferencesDtoSchema
>;
