import { z } from 'zod';
import { studentSchema } from '../schemas';

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

export type UpdateStudentDtoSchema = z.infer<typeof updateStudentDtoSchema>;
