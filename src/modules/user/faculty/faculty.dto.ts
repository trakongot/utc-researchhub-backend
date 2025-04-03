import { z } from 'zod';

export const CreateFacultyDto = z.object({
  facultyCode: z.string().min(3, 'Mã giảng viên phải có ít nhất 3 ký tự'),
  fullName: z.string().min(2, 'Tên giảng viên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phoneNumber: z.string().optional(),
  bio: z
    .string()
    .max(500, 'Giới thiệu bản thân phải nhỏ hơn 500 ký tự')
    .optional(),
  rank: z.string().optional(),
  departmentId: z.string().optional(),
  roles: z
    .array(
      z.enum([
        'ADMIN',
        'DEAN',
        'DEPARTMENT_HEAD',
        'SECRETARY',
        'LECTURER',
        'ADVISOR',
      ]),
    )
    .optional(),
});

export type CreateFacultyDto = z.infer<typeof CreateFacultyDto>;

export const UpdateFacultyDto = z.object({
  facultyCode: z
    .string()
    .min(3, 'Mã giảng viên phải có ít nhất 3 ký tự')
    .optional(),
  fullName: z
    .string()
    .min(2, 'Tên giảng viên phải có ít nhất 2 ký tự')
    .optional(),
  email: z.string().email('Email không hợp lệ').optional(),
  phoneNumber: z.string().optional(),
  bio: z
    .string()
    .max(500, 'Giới thiệu bản thân phải nhỏ hơn 500 ký tự')
    .optional(),
  rank: z.string().optional(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'RETIRED', 'RESIGNED', 'ON_LEAVE'])
    .optional(),
  departmentId: z.string().optional(),
  profilePicture: z.string().optional(),
});

export type UpdateFacultyDto = z.infer<typeof UpdateFacultyDto>;

export const FindFacultyDto = z.object({
  facultyCode: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().max(100).default(20),
  orderBy: z.enum(['fullName', 'facultyCode', 'email', 'createdAt']).optional(),
  asc: z.enum(['asc', 'desc']).optional(),
  departmentId: z.string().optional(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'RETIRED', 'RESIGNED', 'ON_LEAVE'])
    .optional(),
  role: z
    .enum([
      'ADMIN',
      'DEAN',
      'DEPARTMENT_HEAD',
      'SECRETARY',
      'LECTURER',
      'ADVISOR',
    ])
    .optional(),
});

export type FindFacultyDto = z.infer<typeof FindFacultyDto>;

export const CreateFacultyRoleDto = z.object({
  facultyId: z.string(),
  role: z.enum([
    'ADMIN',
    'DEAN',
    'DEPARTMENT_HEAD',
    'SECRETARY',
    'LECTURER',
    'ADVISOR',
  ]),
});

export type CreateFacultyRoleDto = z.infer<typeof CreateFacultyRoleDto>;
