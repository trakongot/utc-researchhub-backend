import { DraftTopicStatusT, UserT } from '@prisma/client';
import { z } from 'zod';

const ErrRequired = (field: string) => `${field} không được để trống.`;
const ErrInvalidUUID = (field: string) => `${field} phải là một UUID hợp lệ.`;
const ErrMinLength = (field: string, length: number) =>
  `${field} phải có ít nhất ${length} ký tự.`;
const ErrInvalidDate = (field: string) => `${field} phải là một ngày hợp lệ.`;
const ErrEnumValue = (field: string) => `${field} không hợp lệ.`;

export const draftTopicSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')),
  title: z.string().min(3, ErrMinLength('Tiêu đề', 3)),
  description: z.string().nullable(),
  field: z.string().min(1, ErrRequired('Lĩnh vực')),
  subField: z.string().nullable(),

  creatorId: z.string().uuid(ErrInvalidUUID('ID người tạo')),
  creatorType: z
    .nativeEnum(UserT, {
      errorMap: () => ({ message: ErrEnumValue('Loại người tạo') }),
    })
    .default('STUDENT'),

  approvedById: z.string().uuid(ErrInvalidUUID('ID người duyệt')).optional(),
  approvedAt: z
    .date({ invalid_type_error: ErrInvalidDate('Thời gian phê duyệt') })
    .optional(),

  proposalOutlineId: z
    .string()
    .uuid(ErrInvalidUUID('ID đề cương đề xuất'))
    .optional(), 
  proposalDeadline: z
    .date({ invalid_type_error: ErrInvalidDate('Hạn nộp đề xuất') })
    .optional(),
  topicLockDate: z
    .date({ invalid_type_error: ErrInvalidDate('Ngày khóa đề tài') })
    .optional(),

  status: z
    .nativeEnum(DraftTopicStatusT, {
      errorMap: () => ({ message: ErrEnumValue('Trạng thái đề tài') }),
    })
    .default(DraftTopicStatusT.PENDING_ADVISOR),

  createdAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày tạo') }),
  updatedAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày cập nhật') }),

  studentsId: z.string().uuid(ErrInvalidUUID('ID sinh viên')).optional(),
});

export type DraftTopic = z.infer<typeof draftTopicSchema>;
