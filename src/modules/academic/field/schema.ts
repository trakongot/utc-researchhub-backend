import { ErrInvalidUUID, ErrMinLength } from 'src/share/errors.constants';
import { z } from 'zod';

export const FieldSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')).optional(),
  name: z.string().min(2, ErrMinLength('Tên lĩnh vực', 3)),
  parentId: z.string().uuid(ErrInvalidUUID('ID lĩnh vực cha')).optional(),
});

export type Field = z.infer<typeof FieldSchema>;

export const FieldUpdateSchema = FieldSchema.partial();

export type LecturerPreferencesUpdate = z.infer<typeof FieldSchema>;
