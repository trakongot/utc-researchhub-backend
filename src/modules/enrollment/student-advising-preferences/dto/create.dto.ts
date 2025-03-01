import { z } from 'zod';
import { studentAdvisingPreferencesSchema } from '../schema';

export const createStudentAdvisingPreferencesDtoSchema =
  studentAdvisingPreferencesSchema
    .pick({
      studentId: true,
      facultyMemberId: true,
      fieldId: true,
    })
    .required({
      studentId: true,
      facultyMemberId: true,
      fieldId: true,
    });

export type CreateStudentAdvisingPreferencesDto = z.infer<
  typeof createStudentAdvisingPreferencesDtoSchema
>;
