import { z } from 'zod';
import { projectAllocationSchema } from '../schema';

export const createProjectAllocationDtoSchema = projectAllocationSchema
  .pick({
    studentId: true,
    lecturerId: true,
    topicTitle: true,
  })
  .required({
    studentId: true,
    lecturerId: true,
    topicTitle: true,
  });

export type CreateProjectAllocationDto = z.infer<
  typeof createProjectAllocationDtoSchema
>;
