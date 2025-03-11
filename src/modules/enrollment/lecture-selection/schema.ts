import {
  ErrInvalidUUID,
  ErrMinLength,
  ErrRequired,
} from 'src/share/errors.constants';
import { z } from 'zod';

export const lecturerSelectionSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')).optional(),
  position: z.number().min(1, ErrRequired('Vị trí')),
  studyFieldId: z.string(),
  topicTitle: z.string().min(3, ErrMinLength('Tiêu đề đề tài', 3)),
  description: z.string().optional(),
  lecturerId: z.string(),
});

export type LecturerSelection = z.infer<typeof lecturerSelectionSchema>;
