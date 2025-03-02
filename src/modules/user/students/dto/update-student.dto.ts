import { z } from 'zod';
import { studentSchema } from '../schema';

export const updateStudentDtoSchema = studentSchema
  .pick({
    studentCode: true,
    bio: true,
    fullName: true,
    email: true,
    password: true,
    profilePicture: true,
  })
  .partial();

export type UpdateStudentDto = z.infer<typeof updateStudentDtoSchema>;
