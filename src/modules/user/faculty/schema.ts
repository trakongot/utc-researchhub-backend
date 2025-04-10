import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Define faculty roles for Swagger
export enum FacultyStatusT {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RETIRED = 'RETIRED',
  RESIGNED = 'RESIGNED',
  ON_LEAVE = 'ON_LEAVE',
}

// Define faculty roles for Swagger
export enum FacultyRoleT {
  ADMIN = 'ADMIN',
  DEAN = 'DEAN',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  SECRETARY = 'SECRETARY',
  LECTURER = 'LECTURER',
  ADVISOR = 'ADVISOR',
}

// Create Faculty schema
export const CreateFacultySchema = z.object({
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

// Create Faculty DTO with Swagger documentation
export class CreateFacultyDto extends createZodDto(CreateFacultySchema) {
  @ApiProperty({
    description: 'Mã giảng viên',
    example: 'GV001',
    minLength: 3,
  })
  facultyCode: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
    minLength: 2,
  })
  fullName: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: '********',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Giới thiệu bản thân',
    example: 'Giảng viên với 10 năm kinh nghiệm...',
    required: false,
    maxLength: 500,
  })
  bio?: string;

  @ApiProperty({
    description: 'Học hàm/học vị',
    example: 'Tiến sĩ',
    required: false,
  })
  rank?: string;

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({
    description: 'Vai trò trong trường',
    example: ['LECTURER', 'ADVISOR'],
    enum: FacultyRoleT,
    isArray: true,
    required: false,
  })
  roles?: FacultyRoleT[];
}

// Update Faculty schema
export const UpdateFacultySchema = z.object({
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

// Update Faculty DTO with Swagger documentation
export class UpdateFacultyDto extends createZodDto(UpdateFacultySchema) {
  @ApiProperty({
    description: 'Mã giảng viên',
    example: 'GV001',
    minLength: 3,
    required: false,
  })
  facultyCode?: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
    minLength: 2,
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Giới thiệu bản thân',
    example: 'Giảng viên với 10 năm kinh nghiệm...',
    required: false,
    maxLength: 500,
  })
  bio?: string;

  @ApiProperty({
    description: 'Học hàm/học vị',
    example: 'Tiến sĩ',
    required: false,
  })
  rank?: string;

  @ApiProperty({
    description: 'Trạng thái',
    enum: FacultyStatusT,
    example: FacultyStatusT.ACTIVE,
    required: false,
  })
  status?: FacultyStatusT;

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profilePicture?: string;
}

// Find Faculty schema
export const FindFacultySchema = z.object({
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

// Find Faculty DTO with Swagger documentation
export class FindFacultyDto extends createZodDto(FindFacultySchema) {
  @ApiProperty({
    description: 'Mã giảng viên',
    example: 'GV001',
    required: false,
  })
  facultyCode?: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Số trang',
    example: 1,
    default: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng bản ghi mỗi trang',
    example: 20,
    default: 20,
    maximum: 100,
  })
  limit: number;

  @ApiProperty({
    description: 'Sắp xếp theo trường',
    enum: ['fullName', 'facultyCode', 'email', 'createdAt'],
    required: false,
  })
  orderBy?: 'fullName' | 'facultyCode' | 'email' | 'createdAt';

  @ApiProperty({
    description: 'Thứ tự sắp xếp',
    enum: ['asc', 'desc'],
    required: false,
  })
  asc?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({
    description: 'Trạng thái',
    enum: FacultyStatusT,
    required: false,
  })
  status?: FacultyStatusT;

  @ApiProperty({
    description: 'Vai trò',
    enum: FacultyRoleT,
    required: false,
  })
  role?: FacultyRoleT;
}

// Create Faculty Role schema
export const CreateFacultyRoleSchema = z.object({
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

// Create Faculty Role DTO with Swagger documentation
export class CreateFacultyRoleDto extends createZodDto(
  CreateFacultyRoleSchema,
) {
  @ApiProperty({
    description: 'ID giảng viên',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  facultyId: string;

  @ApiProperty({
    description: 'Vai trò',
    enum: FacultyRoleT,
    example: FacultyRoleT.LECTURER,
  })
  role: FacultyRoleT;
}

// Faculty response DTO for Swagger
export class FacultyResponseDto {
  @ApiProperty({
    description: 'ID giảng viên',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Mã giảng viên',
    example: 'GV001',
  })
  facultyCode: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Trạng thái',
    enum: FacultyStatusT,
    example: FacultyStatusT.ACTIVE,
  })
  status: FacultyStatusT;

  @ApiProperty({
    description: 'Học hàm/học vị',
    example: 'Tiến sĩ',
  })
  rank: string;

  @ApiProperty({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/profile.jpg',
  })
  profilePicture: string;

  @ApiProperty({
    description: 'Giới thiệu bản thân',
    example: 'Giảng viên với 10 năm kinh nghiệm...',
  })
  bio: string;

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  departmentId: string;

  @ApiProperty({
    description: 'Danh sách vai trò',
    example: [FacultyRoleT.LECTURER, FacultyRoleT.ADVISOR],
    enum: FacultyRoleT,
    isArray: true,
  })
  roles: FacultyRoleT[];

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật cuối',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
