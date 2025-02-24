import { z } from 'zod';

const ErrRequired = (field: string) => `${field} không được để trống.`;
const ErrInvalidUUID = (field: string) => `${field} phải là một UUID hợp lệ.`;
const ErrMinLength = (field: string, length: number) =>
  `${field} phải có ít nhất ${length} ký tự.`;
const ErrInvalidDate = (field: string) => `${field} phải là một ngày hợp lệ.`;

export const lecturecPreferencesSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')),

  position: z.number().min(1, ErrRequired('Vị trí')),

  field: z.string().min(1, ErrRequired('Lĩnh vực')),
  subField: z.string().nullable(),

  topicTitle: z.string().min(3, ErrMinLength('Tiêu đề đề tài', 3)),
  description: z.string().nullable(),

  lecturerId: z.string().uuid(ErrInvalidUUID('ID giảng viên')),

  createdAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày tạo') }),
  updatedAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày cập nhật') }),
});

export type LecturecPreferences = z.infer<typeof lecturecPreferencesSchema>;
