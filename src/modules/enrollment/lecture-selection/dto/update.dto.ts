import { z } from 'zod';
import { lecturerSelectionSchema } from '../schema';

export const updateLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    position: true,
    studyFieldId: true,
    topicTitle: true,
    description: true,
  })
  .partial();

export type UpdateLecturerSelectionDto = z.infer<
  typeof updateLecturerSelectionDtoSchema
>;
