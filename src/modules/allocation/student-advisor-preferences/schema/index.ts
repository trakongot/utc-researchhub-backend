import { z } from 'zod';

const ErrRequired = (field: string) => `${field} không được để trống.`;
const ErrInvalidUUID = (field: string) => `${field} phải là một UUID hợp lệ.`;
const ErrMinLength = (field: string, length: number) =>
  `${field} phải có ít nhất ${length} ký tự.`;
const ErrInvalidDate = (field: string) => `${field} phải là một ngày hợp lệ.`;

export const studentAdvisorPreferencesSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')),

  topicTitle: z.string().min(3, ErrMinLength('Tiêu đề đề tài', 3)),

  preferredAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày ưu tiên') }),
  createdAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày tạo') }),
  updatedAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày cập nhật') }),

  studentId: z.string().uuid(ErrInvalidUUID('ID sinh viên')),
  facultyMemberId: z.string().uuid(ErrInvalidUUID('ID giảng viên')),
});

export type StudentAdvisorPreferences = z.infer<
  typeof studentAdvisorPreferencesSchema
>;
