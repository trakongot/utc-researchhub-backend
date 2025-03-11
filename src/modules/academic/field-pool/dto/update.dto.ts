import { z } from 'zod';
import { createFieldPoolSchema } from './create.dto';

export const updateFieldPoolSchema = createFieldPoolSchema.partial();

export type updateFieldPoolDto = z.infer<typeof updateFieldPoolSchema>;
