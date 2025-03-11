import { ErrRequired } from 'src/share/errors.constants';
import { z } from 'zod';

export const projectAllocationSchema = z.object({
  id: z.string(),
  topicTitle: z.string().min(3, ErrRequired('Tên đề tài')),
  allocatedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  studentId: z.string(),
  lecturerId: z.string(),
});

export type ProjectAllocations = z.infer<typeof projectAllocationSchema>;
