import { DepartmentStatusT } from '@prisma/client';
import { z } from 'zod';

const ErrRequired = (field: string) => `${field} không được để trống.`;
const ErrInvalidUUID = (field: string) => `${field} phải là một UUID hợp lệ.`;

export const departmentSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')),
  code: z.string().min(1, ErrRequired('Mã khoa')),
  name: z.string().min(1, ErrRequired('Tên khoa')),
  description: z.string().nullable(),
  status: z.nativeEnum(DepartmentStatusT).default(DepartmentStatusT.ACTIVE),
  createdAt: z.date({ invalid_type_error: 'Ngày tạo không hợp lệ' }),
  updatedAt: z.date({ invalid_type_error: 'Ngày cập nhật không hợp lệ' }),
  parentDepartmentId: z.string().uuid(ErrInvalidUUID('ID khoa cha')).nullable(),
});

export type Department = z.infer<typeof departmentSchema>;
