import { z } from 'zod';
import { lecturerSchema } from '../schema';

export const updateLecturerDtoSchema = lecturerSchema
  .pick({
    fullName: true,
    facultyCode: true,
    bio: true,
    email: true,
    password: true,
    profilePicture: true,
  })
  .partial();

export type UpdateLecturerDto = z.infer<typeof updateLecturerDtoSchema>;
