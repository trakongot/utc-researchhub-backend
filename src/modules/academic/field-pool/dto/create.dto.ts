import { z } from 'zod';
import { FieldPoolSchema } from '../schema';

export const createFieldPoolSchema = FieldPoolSchema.pick({
  name: true,
  description: true,
  registrationDeadline: true,
}).required({
  name: true,
});
export type createFieldPoolDto = z.infer<typeof createFieldPoolSchema>;
