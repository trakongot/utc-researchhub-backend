import { createZodDto } from 'nestjs-zod';
import { FieldSchema } from '../schemas';

export const createFieldDtoSchema = FieldSchema.pick({
  name: true,
  parentId: true,
}).required({
  name: true,
});

export class CreateFieldDto extends createZodDto(createFieldDtoSchema) {}
