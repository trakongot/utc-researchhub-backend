import { z } from 'zod';
import { studentSchema } from '../schema';

export const updateStudentBySelfDtoSchema = studentSchema
  .pick({
    bio: true,
    phone: true,
    profilePicture: true,
    email: true,
  })
  .partial()
  .strict();
export type UpdateStudentBySelfDto = z.infer<
  typeof updateStudentBySelfDtoSchema
>;
