import { z } from 'zod';
import { studentSelectionSchema } from '../schema';

export const createStudentSelectionDtoSchema = studentSelectionSchema
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

export type CreateStudentSelectionDto = z.infer<
  typeof createStudentSelectionDtoSchema
>;
