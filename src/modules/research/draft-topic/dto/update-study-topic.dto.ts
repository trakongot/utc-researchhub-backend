import { z } from 'zod';
import { draftTopicSchema } from '../schemas/draft-topic.schema';

export const updateDraftTopicDtoSchema = draftTopicSchema
  .pick({
    title: true,
    description: true,
    field: true,
    subField: true,
    proposalOutlineId: true,
    proposalDeadline: true,
    topicLockDate: true,
    status: true,
  })
  .partial();

export type UpdateDraftTopicDto = z.infer<typeof updateDraftTopicDtoSchema>;
