import { z } from 'zod';
import { studentSchema } from '../schema';

export const createStudentDtoSchema = studentSchema.pick({
  studentCode: true,
  bio: true,
  fullName: true,
  email: true,
  password: true,
  profilePicture: true,
  departmentId: true,
});

export type CreateStudentDto = z.infer<typeof createStudentDtoSchema>;
