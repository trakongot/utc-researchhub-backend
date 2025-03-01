import { z } from 'zod';
import { FieldSchema } from '../schema';

export const findFieldDtoSchema = FieldSchema.pick({
  name: true,
  parentId: true,
})
  .extend({
    keyword: z.string(),
    parentId: z.string(),
    orderBy: z.string(),
    asc: z.enum(['asc', 'desc']),
    lastId: z.string(),
    page: z.number().min(1),
    limit: z.number().max(100),
  })
  .partial();
export type FindFieldDto = z.infer<typeof findFieldDtoSchema>;
