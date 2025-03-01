import { z } from 'zod';
import { FieldSchema } from '../schemas';

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
  })
  .partial();
export type FindFieldDto = z.infer<typeof findFieldDtoSchema>;
// export class FindFieldDto extends createZodDto(findFieldDtoSchema) {}
