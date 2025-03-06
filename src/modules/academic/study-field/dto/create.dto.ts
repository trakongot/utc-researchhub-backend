import { z } from 'zod';
import { FieldStudySchema } from '../schema';

export const createStudyFieldDtoSchema = FieldStudySchema.pick({
  name: true,
  parentId: true,
}).required({
  name: true,
});

export type CreateFieldDto = z.infer<typeof createStudyFieldDtoSchema>;
