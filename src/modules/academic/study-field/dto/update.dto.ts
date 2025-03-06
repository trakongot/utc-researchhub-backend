import { z } from 'zod';
import { FieldStudySchema } from '../schema';

export const updateStudyFieldDtoSchema = FieldStudySchema.pick({
  name: true,
  parentId: true,
}).partial();

export type UpdateFieldDto = z.infer<typeof updateStudyFieldDtoSchema>;
