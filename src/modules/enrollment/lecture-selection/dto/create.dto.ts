import { z } from 'zod';
import { lecturerSelectionSchema } from '../schema';

export const createLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    position: true,
    studyFieldId: true,
    topicTitle: true,
    description: true,
    lecturerId: true,
  })
  .required({
    position: true,
    studyFieldId: true,
    topicTitle: true,
    lecturerId: true,
  });
export type CreateLecturerSelectionDto = z.infer<
  typeof createLecturerSelectionDtoSchema
>;
