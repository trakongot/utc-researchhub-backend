import { z } from 'zod';
import { departmentSchema } from '../schema';

export const createDepartmentDtoSchema = departmentSchema.pick({
  code: true,
  name: true,
  description: true,
  parentDepartmentId: true,
});
export type CreateDepartmentDto = z.infer<typeof createDepartmentDtoSchema>;
