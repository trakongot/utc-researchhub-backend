import { z } from 'zod';
import { draftTopicSchema } from '../schemas';

export const findDraftTopicDtoSchema = draftTopicSchema
  .pick({
    field: true,
    creatorId: true,
    status: true,
  })
  .partial();

export type FindDraftTopicDto = z.infer<typeof findDraftTopicDtoSchema>;
