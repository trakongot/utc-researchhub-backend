import { z } from 'zod';
import { FieldSchema } from '../schema';

export const createFieldDtoSchema = FieldSchema.pick({
  name: true,
  parentId: true,
}).required({
  name: true,
});

export type CreateFieldDto = z.infer<typeof createFieldDtoSchema>;
