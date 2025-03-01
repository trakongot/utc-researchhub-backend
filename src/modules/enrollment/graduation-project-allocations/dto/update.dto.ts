import { z } from 'zod';
import { graduationProjectAllocationsSchema } from '../schema';

export const updateGraduationProjectAllocationsDtoSchema =
  graduationProjectAllocationsSchema.partial();

export type UpdateGraduationProjectAllocationsDto = z.infer<
  typeof updateGraduationProjectAllocationsDtoSchema
>;
