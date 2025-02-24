import { z } from 'zod';
import { lecturecPreferencesSchema } from '../schemas';

export const findLecturecPreferencesDtoSchema = lecturecPreferencesSchema
  .pick({
    field: true,
    lecturerId: true,
    topicTitle: true,
  })
  .partial();

export type FindLecturecPreferencesDto = z.infer<
  typeof findLecturecPreferencesDtoSchema
>;
