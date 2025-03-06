import { z } from 'zod';
import { studentSelectionSchema } from '../schema';

export const updateStudentSelectionDtoSchema = studentSelectionSchema.partial();

export type UpdateStudentSelectionDto = z.infer<
  typeof updateStudentSelectionDtoSchema
>;
