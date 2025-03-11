import { GenderT, StudentStatusT } from '@prisma/client';
import {
  ErrInvalidDate,
  ErrInvalidUUID,
  ErrRequired,
} from 'src/share/errors.constants';
import { z } from 'zod';

export const studentSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID('ID')), // ID duy nhất của sinh viên
  studentCode: z.string().min(1, ErrRequired('Mã sinh viên')), // Mã sinh viên duy nhất
  majorCode: z.string().optional(), // Mã ngành học
  programCode: z.string().optional(), // Mã chương trình học
  bio: z.string().optional(), 
  fullName: z.string().min(1, ErrRequired('Họ và tên')), 
  email: z.string().email(ErrRequired('Email')), 
  phone: z.string().optional(), 
  dateOfBirth: z.date().optional(), 
  gender: z.nativeEnum(GenderT).optional(), 
  admissionYear: z.number().optional(), // Năm nhập học
  graduationYear: z.number().optional(), // Năm tốt nghiệp dự kiến
  currentGpa: z.number().optional(), // Điểm trung bình tích lũy (GPA)
  creditsEarned: z.number().optional(), // Tổng số tín chỉ đã tích lũy
  status: z.nativeEnum(StudentStatusT).default(StudentStatusT.ACTIVE),
  createdAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày tạo') }), 
  updatedAt: z.date({ invalid_type_error: ErrInvalidDate('Ngày cập nhật') }), 
  profilePicture: z.string().optional(), 
  lastLogin: z.date().optional(), 
  isOnline: z.boolean().default(false), 
  departmentId: z.string().uuid(ErrInvalidUUID('ID khoa')).optional(), // Mã khoa của sinh viên
});

export type Student = z.infer<typeof studentSchema>;
