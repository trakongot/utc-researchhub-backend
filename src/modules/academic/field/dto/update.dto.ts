import { z } from 'zod';
import { FieldSchema } from '../schema';

export const updateFieldDtoSchema = FieldSchema.pick({
  name: true,
  parentId: true,
}).partial();

export type UpdateFieldDto = z.infer<typeof updateFieldDtoSchema>;
