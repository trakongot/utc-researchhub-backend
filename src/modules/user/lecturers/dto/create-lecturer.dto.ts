import { z } from 'zod';
import { lecturerSchema } from '../schema';

export const createLecturerDtoSchema = lecturerSchema.pick({
  fullName: true,
  facultyCode: true,
  bio: true,
  email: true,
  password: true,
  profilePicture: true,
  departmentId: true,
});
export type CreateLecturerDto = z.infer<typeof createLecturerDtoSchema>;
