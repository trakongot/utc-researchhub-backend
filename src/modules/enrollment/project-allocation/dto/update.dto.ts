import { z } from 'zod';
import { projectAllocationSchema } from '../schema';

export const updateProjectAllocationDtoSchema =
  projectAllocationSchema.partial();

export type UpdateProjectAllocationDto = z.infer<
  typeof updateProjectAllocationDtoSchema
>;
