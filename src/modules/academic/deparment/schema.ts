import { DepartmentStatusT } from '@prisma/client';
import { ErrRequired } from 'src/share/errors.constants';
import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.string(),
  departmentCode: z.string().min(1, ErrRequired('Mã khoa')),
  name: z.string().min(1, ErrRequired('Tên khoa')),
  description: z.string().optional(),
  status: z.nativeEnum(DepartmentStatusT).default(DepartmentStatusT.ACTIVE),
  createdAt: z.date({ invalid_type_error: 'Ngày tạo không hợp lệ' }),
  updatedAt: z.date({ invalid_type_error: 'Ngày cập nhật không hợp lệ' }),
  parentDepartmentId: z.string().optional(),
});

export type Department = z.infer<typeof departmentSchema>;
