import { ApiProperty } from '@nestjs/swagger';
import { GenderT, StudentStatusT } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Create Student schema
export const CreateStudentSchema = z.object({
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

// Create Student DTO with Swagger documentation
export class CreateStudentDto extends createZodDto(CreateStudentSchema) {
  @ApiProperty({
    description: 'Mã sinh viên',
    example: '123456',
    minLength: 3,
  })
  studentCode: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    minLength: 2,
  })
  fullName: string;

  @ApiProperty({
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: '123456',
  })
  password: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
  })
  phone?: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '2000-01-01T00:00:00.000Z',
  })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Giới tính',
    enum: GenderT,
  })
  gender?: GenderT;

  @ApiProperty({
    description: 'Năm nhập học',
  })
  admissionYear?: number;

  @ApiProperty({
    description: 'Năm tốt nghiệp dự kiến',
  })
  graduationYear?: number;

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
  })
  departmentId?: string;

  @ApiProperty({
    description: 'Mã chuyên ngành',
  })
  majorCode?: string;

  @ApiProperty({
    description: 'Mã chương trình đào tạo',
  })
  programCode?: string;

  @ApiProperty({
    description: 'Giới thiệu bản thân',
  })
  bio?: string;
}

// Update Student schema
export const UpdateStudentSchema = z.object({
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

// Update Student DTO with Swagger documentation
export class UpdateStudentDto extends createZodDto(UpdateStudentSchema) {
  @ApiProperty({
    description: 'Mã sinh viên',
    example: 'SV001',
    minLength: 3,
    required: false,
  })
  studentCode?: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn B',
    minLength: 2,
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvanb@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '2000-01-01T00:00:00.000Z',
    required: false,
  })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Giới tính',
    enum: GenderT,
    example: GenderT.MALE,
    required: false,
  })
  gender?: GenderT;

  @ApiProperty({
    description: 'Năm nhập học',
    example: 2020,
    minimum: 2000,
    maximum: 2100,
    required: false,
  })
  admissionYear?: number;

  @ApiProperty({
    description: 'Năm tốt nghiệp dự kiến',
    example: 2024,
    minimum: 2000,
    maximum: 2100,
    required: false,
  })
  graduationYear?: number;

  @ApiProperty({
    description: 'Điểm trung bình hiện tại',
    example: 3.5,
    minimum: 0,
    maximum: 4,
    required: false,
  })
  currentGpa?: number;

  @ApiProperty({
    description: 'Số tín chỉ đã tích lũy',
    example: 100,
    minimum: 0,
    required: false,
  })
  creditsEarned?: number;

  @ApiProperty({
    description: 'Trạng thái',
    enum: StudentStatusT,
    example: StudentStatusT.ACTIVE,
    required: false,
  })
  status?: StudentStatusT;

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({
    description: 'Mã chuyên ngành',
    example: 'CNTT',
    required: false,
  })
  majorCode?: string;

  @ApiProperty({
    description: 'Mã chương trình đào tạo',
    example: 'CQ',
    required: false,
  })
  programCode?: string;

  @ApiProperty({
    description: 'Giới thiệu bản thân',
    example: 'Sinh viên năm thứ 3 chuyên ngành công nghệ thông tin...',
    required: false,
    maxLength: 500,
  })
  bio?: string;

  @ApiProperty({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profilePicture?: string;
}

// Find Student schema
export const FindStudentSchema = z.object({
  studentCode: z
    .string({ message: 'Mã sinh viên không được để trống' })
    .optional(),
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

// Find Student DTO with Swagger documentation
export class FindStudentDto extends createZodDto(FindStudentSchema) {
  @ApiProperty({
    description: 'Mã sinh viên',
    required: false,
  })
  studentCode?: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Số trang',
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng bản ghi mỗi trang',
  })
  limit: number;

  @ApiProperty({
    description: 'Sắp xếp theo trường',
    enum: ['fullName', 'studentCode', 'email', 'createdAt'],
  })
  orderBy?: 'fullName' | 'studentCode' | 'email' | 'createdAt';

  @ApiProperty({
    description: 'Thứ tự sắp xếp',
    enum: ['asc', 'desc'],
  })
  asc?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
  })
  departmentId?: string;

  @ApiProperty({
    description: 'Trạng thái',
    enum: StudentStatusT,
  })
  status?: StudentStatusT;

  @ApiProperty({
    description: 'Mã chuyên ngành',
  })
  majorCode?: string;
}

// Student response DTO for Swagger
export class StudentResponseDto {
  @ApiProperty({
    description: 'ID sinh viên',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Mã sinh viên',
    example: 'SV001',
  })
  studentCode: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn B',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvanb@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
  })
  phone: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '2000-01-01T00:00:00.000Z',
  })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Giới tính',
    enum: GenderT,
    example: GenderT.MALE,
  })
  gender: GenderT;

  @ApiProperty({
    description: 'Năm nhập học',
    example: 2020,
  })
  admissionYear: number;

  @ApiProperty({
    description: 'Năm tốt nghiệp dự kiến',
    example: 2024,
  })
  graduationYear: number;

  @ApiProperty({
    description: 'Điểm trung bình hiện tại',
    example: 3.5,
  })
  currentGpa: number;

  @ApiProperty({
    description: 'Số tín chỉ đã tích lũy',
    example: 100,
  })
  creditsEarned: number;

  @ApiProperty({
    description: 'Trạng thái',
    enum: StudentStatusT,
  })
  status: StudentStatusT;

  @ApiProperty({
    description: 'Mã khoa/bộ môn',
  })
  departmentId: string;

  @ApiProperty({
    description: 'Mã chuyên ngành',
  })
  majorCode: string;

  @ApiProperty({
    description: 'Mã chương trình đào tạo',
  })
  programCode: string;

  @ApiProperty({
    description: 'Giới thiệu bản thân',
  })
  bio: string;

  @ApiProperty({
    description: 'URL ảnh đại diện',
  })
  profilePicture: string;

  @ApiProperty({
    description: 'Thời gian tạo',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật cuối',
  })
  updatedAt: Date;
}
