import { FacultyStatusT } from '@prisma/client';
import { z } from 'zod';

const ErrRequired = (field: string) => `${field} không được để trống.`;
const ErrInvalidUUID = (field: string) => `${field} phải là một UUID hợp lệ.`;
const ErrInvalidEmail = (field: string) =>
  `${field} không phải là email hợp lệ.`;

const ErrMinLength = (field: string, length: number) =>
  `${field} phải có ít nhất ${length} ký tự.`;
const ErrInvalidDate = (field: string) => `${field} phải là một ngày hợp lệ.`;

export const lecturerSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')),
  fullName: z.string().min(1, ErrRequired('Họ và tên')),
  facultyCode: z.string().min(1, ErrRequired('Mã giảng viên')).optional(),
  bio: z.string().nullable(),
  email: z.string().email(ErrInvalidEmail('Email')),
  password: z.string().min(1, ErrRequired('Mật khẩu')),
  status: z.nativeEnum(FacultyStatusT).default(FacultyStatusT.ACTIVE),
  createdAt: z.date({ invalid_type_error: 'Ngày tạo không hợp lệ' }),
  updatedAt: z.date({ invalid_type_error: 'Ngày cập nhật không hợp lệ' }),
  isDeleted: z.boolean().default(false),
  profilePicture: z.string().nullable(),
  lastLogin: z.date().nullable(),
  isOnline: z.boolean().default(false),
  departmentId: z.string().uuid(ErrInvalidUUID('ID khoa')).nullable(),
});

export type Lecturer = z.infer<typeof lecturerSchema>;
