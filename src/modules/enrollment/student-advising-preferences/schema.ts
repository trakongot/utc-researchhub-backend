import { z } from 'zod';

export const studentAdvisingPreferencesSchema = z.object({
  id: z.string().optional(),
  preferredAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  studentId: z.string(),
  facultyMemberId: z.string(),
  fieldId: z.string(),
});

export type StudentAdvisingPreferences = z.infer<
  typeof studentAdvisingPreferencesSchema
>;
