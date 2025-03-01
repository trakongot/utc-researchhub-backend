import { createZodDto } from 'nestjs-zod';
import { FieldSchema } from '../schemas';

export const updateFieldDtoSchema = FieldSchema.pick({
  name: true,
  parentId: true,
}).partial();

export class UpdateFieldDto extends createZodDto(updateFieldDtoSchema) {}
