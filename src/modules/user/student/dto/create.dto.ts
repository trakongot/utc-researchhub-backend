import { z } from 'zod';
import { studentSchema } from '../schema';

export const createStudentDtoSchema = studentSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastLogin: true,
    isOnline: true,
  })
  .strict();
export type CreateStudentDto = z.infer<typeof createStudentDtoSchema>;
