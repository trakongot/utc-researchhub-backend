import {
  ErrInvalidUUID,
  ErrMaxLength,
  ErrMinLength,
} from 'src/share/errors.constants';
import { z } from 'zod';

export const FieldPoolSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')).optional(),
  name: z
    .string()
    .min(2, ErrMinLength('Tên lĩnh vực', 2))
    .max(255, ErrMaxLength('Tên lĩnh vực', 255)),
  description: z.string().max(500, ErrMaxLength('Mô tả', 500)).optional(),
  registrationDeadline: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type FieldPool = z.infer<typeof FieldPoolSchema>;

export const FieldPoolUpdateSchema = FieldPoolSchema.partial();
export type FieldPoolUpdate = z.infer<typeof FieldPoolUpdateSchema>;
