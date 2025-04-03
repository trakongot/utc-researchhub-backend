import { z } from 'zod';

export const CreateStudentDto = z.object({
  studentCode: z.string().min(3, 'Mã sinh viên phải có ít nhất 3 ký tự'),
  fullName: z.string().min(2, 'Tên sinh viên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  admissionYear: z.number().int().min(2000).max(2100).optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional(),
  departmentId: z.string().optional(),
  majorCode: z.string().optional(),
  programCode: z.string().optional(),
  bio: z
    .string()
    .max(500, 'Giới thiệu bản thân phải nhỏ hơn 500 ký tự')
    .optional(),
});

export type CreateStudentDto = z.infer<typeof CreateStudentDto>;

export const UpdateStudentDto = z.object({
  studentCode: z
    .string()
    .min(3, 'Mã sinh viên phải có ít nhất 3 ký tự')
    .optional(),
  fullName: z
    .string()
    .min(2, 'Tên sinh viên phải có ít nhất 2 ký tự')
    .optional(),
  email: z.string().email('Email không hợp lệ').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  admissionYear: z.number().int().min(2000).max(2100).optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional(),
  currentGpa: z.number().min(0).max(4).optional(),
  creditsEarned: z.number().int().min(0).optional(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED_OUT', 'ON_LEAVE'])
    .optional(),
  departmentId: z.string().optional(),
  majorCode: z.string().optional(),
  programCode: z.string().optional(),
  bio: z
    .string()
    .max(500, 'Giới thiệu bản thân phải nhỏ hơn 500 ký tự')
    .optional(),
  profilePicture: z.string().optional(),
});

export type UpdateStudentDto = z.infer<typeof UpdateStudentDto>;
export const FindStudentDto = z.object({
  studentCode: z.string({ message: 'Mã sinh viên không được để trống' }).optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().max(100).default(20),
  orderBy: z.enum(['fullName', 'studentCode', 'email', 'createdAt']).optional(),
  asc: z.enum(['asc', 'desc']).optional(),
  departmentId: z.string().optional(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED_OUT', 'ON_LEAVE'])
    .optional(),
  majorCode: z.string().optional(),
});

export type FindStudentDto = z.infer<typeof FindStudentDto>;
