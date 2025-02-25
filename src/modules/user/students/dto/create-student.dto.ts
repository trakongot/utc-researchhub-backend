import { z } from 'zod';
import { studentSchema } from '../schemas';

export const createStudentDtoSchema = studentSchema.pick({
  studentCode: true,
  bio: true,
  fullName: true,
  email: true,
  password: true,
  profilePicture: true,
  departmentId: true,
});

export type CreateStudentDtoSchema = z.infer<typeof createStudentDtoSchema>;
