import { z } from 'zod';
import { studentAdvisingPreferencesSchema } from '../schema';

export const updateStudentAdvisingPreferencesDtoSchema =
  studentAdvisingPreferencesSchema.partial();

export type UpdateStudentAdvisingPreferencesDto = z.infer<
  typeof updateStudentAdvisingPreferencesDtoSchema
>;
