import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StudentLoginSchema = z.object({
  studentCode: z.string().min(1, 'Mã sinh viên là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự'),
});
export type JwtPayload = {
  id: string;
  userType: 'STUDENT' | 'FACULTY';
  roles: string[];
  // email: string;
  code: string;
};
export class StudentLoginDto extends createZodDto(StudentLoginSchema) {
  @ApiProperty({ example: '20A10010' })
  studentCode: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

export const FacultyLoginSchema = z.object({
  facultyCode: z.string().min(1, 'Mã giảng viên là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự'),
});

export class FacultyLoginDto extends createZodDto(FacultyLoginSchema) {
  @ApiProperty({ example: 'GV001' })
  facultyCode: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

export const LoginByCodeSchema = z.object({
  code: z.string().min(1, 'Mã đăng nhập là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự'),
  userType: z.enum(['STUDENT', 'FACULTY'], {
    errorMap: () => ({ message: 'Loại người dùng không hợp lệ' }),
  }),
});

export class LoginByCodeDto extends createZodDto(LoginByCodeSchema) {
  @ApiProperty({
    example: '123456',
    description: 'Mã sinh viên hoặc mã giảng viên',
  })
  code: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'STUDENT', enum: ['STUDENT', 'FACULTY'] })
  userType: 'STUDENT' | 'FACULTY';
}
