import { StudentStatusT } from '@prisma/client';
import { z } from 'zod';

const ErrRequired = (field: string) => `${field} không được để trống.`;
const ErrInvalidUUID = (field: string) => `${field} phải là một UUID hợp lệ.`;
const ErrMinLength = (field: string, length: number) =>
  `${field} phải có ít nhất ${length} ký tự.`;
const ErrInvalidDate = (field: string) => `${field} phải là một ngày hợp lệ.`;

export const studentSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')),
  studentCode: z.string().min(1, ErrRequired('Mã sinh viên')),
  bio: z.string().nullable(),
  fullName: z.string().min(1, ErrRequired('Họ và tên')),
  email: z.string().email(ErrRequired('Email')),
  password: z.string().min(1, ErrRequired('Mật khẩu')),
  status: z.nativeEnum(StudentStatusT).default(StudentStatusT.ACTIVE),
  createdAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày tạo') }),
  updatedAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày cập nhật') }),
  isDeleted: z.boolean().default(false),
  profilePicture: z.string().nullable(),
  lastLogin: z.date().nullable(),
  isOnline: z.boolean().default(false),
  departmentId: z.string().uuid(ErrInvalidUUID('ID khoa')).nullable(),
});

export type Student = z.infer<typeof studentSchema>;
