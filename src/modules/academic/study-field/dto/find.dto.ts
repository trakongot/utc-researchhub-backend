import { z } from 'zod';
import { FieldStudySchema } from '../schema';

export const findStudyFieldDtoSchema = FieldStudySchema.pick({
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
export type FindFieldDto = z.infer<typeof findStudyFieldDtoSchema>;
