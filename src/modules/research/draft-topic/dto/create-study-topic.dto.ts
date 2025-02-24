import { z } from 'zod';
import { draftTopicSchema } from '../schemas';

export const createDraftTopicDtoSchema = draftTopicSchema
  .pick({
    title: true,
    description: true,
    field: true,
    subField: true,
    creatorId: true,
    creatorType: true,
    proposalOutlineId: true,
    proposalDeadline: true,
    topicLockDate: true,
    status: true,
  })
  .required({
    title: true,
    field: true,
    creatorId: true,
    creatorType: true,
  });

export type CreateDraftTopicDto = z.infer<typeof createDraftTopicDtoSchema>;
