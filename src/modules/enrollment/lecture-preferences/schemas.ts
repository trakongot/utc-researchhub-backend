import {
  ErrInvalidUUID,
  ErrMinLength,
  ErrRequired,
} from 'src/share/errors.constants';
import { z } from 'zod';

export const lecturerPreferencesSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')).optional(),
  position: z.number().min(1, ErrRequired('Vị trí')),
  fieldId: z.string(),
  // fieldId: z.string().uuid(ErrInvalidUUID('ID lĩnh vực')),
  topicTitle: z.string().min(3, ErrMinLength('Tiêu đề đề tài', 3)),
  description: z.string().nullable(),
  lecturerId: z.string().uuid(ErrInvalidUUID('ID giảng viên')),
});

export type LecturerPreferences = z.infer<typeof lecturerPreferencesSchema>;

export const lecturerPreferencesUpdateSchema =
  lecturerPreferencesSchema.partial();

export type LecturerPreferencesUpdate = z.infer<
  typeof lecturerPreferencesUpdateSchema
>;
