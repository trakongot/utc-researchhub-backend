import { z } from 'zod';
import { departmentSchema } from '../schema';

export const updateDepartmentDtoSchema = departmentSchema
  .pick({
    departmentCode: true,
    name: true,
    description: true,
    parentDepartmentId: true,
    status: true,
  })
  .partial();

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentDtoSchema>;
