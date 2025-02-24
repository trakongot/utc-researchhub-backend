import { z } from 'zod';
import { lecturecPreferencesSchema } from '../schemas';

export const createLecturecPreferencesDtoSchema = lecturecPreferencesSchema
  .pick({
    position: true,
    field: true,
    subField: true,
    topicTitle: true,
    description: true,
    lecturerId: true,
  })
  .required({
    position: true,
    field: true,
    topicTitle: true,
    lecturerId: true,
  });

export type CreateLecturecPreferencesDto = z.infer<
  typeof createLecturecPreferencesDtoSchema
>;
