import { ApiProperty } from '@nestjs/swagger';
import { UserT } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Define faculty roles
export enum FacultyRoleT {
  DEAN = 'DEAN', // Dean of the faculty
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD', // Head of department
  ADVISOR = 'ADVISOR', // Research advisor
  REVIEWER = 'REVIEWER', // Research reviewer
  SECRETARY = 'SECRETARY', // Secretary
  LECTURER = 'LECTURER', // Regular lecturer
}


// Login schema with validation
export const LoginByCodeSchema = z.object({
  code: z.string().min(1, 'Mã đăng nhập là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự'),
  userType: z.enum([UserT.STUDENT, UserT.FACULTY], {
    errorMap: () => ({ message: 'Loại người dùng không hợp lệ' }),
  }),
});

// Refresh token schema with validation
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token là bắt buộc'),
});

// Login DTO with Swagger documentation
export class LoginByCodeDto extends createZodDto(LoginByCodeSchema) {
  @ApiProperty({
    example: '123456',
    description: 'Student or faculty code',
  })
  code: string;

  @ApiProperty({
    example: '123456',
    description: 'Password',
  })
  password: string;

  @ApiProperty({
    example: UserT.STUDENT,
    enum: UserT,
  })
  userType: UserT;
}

// Refresh token DTO with Swagger documentation
export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token để lấy access token mới',
  })
  refreshToken: string;
}

// User info DTO for Swagger documentation
export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Student or faculty code',
    example: 'SV001',
  })
  code: string;

  @ApiProperty({
    description: 'User type',
    enum: UserT,
    example: UserT.STUDENT,
  })
  userType: UserT;

  @ApiProperty({
    description: 'User roles',
    enum: FacultyRoleT,
    isArray: true,
    example: [FacultyRoleT.ADVISOR],
  })
  roles: string[];
}

// Response DTOs for Swagger documentation
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 300,
  })
  accessTokenExpiresIn: number;

  @ApiProperty({
    description: 'Refresh token expiration time in seconds',
    example: 604800,
  })
  refreshTokenExpiresIn: number;

  @ApiProperty({
    description: 'User information',
    type: UserInfoDto,
  })
  user: UserInfoDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

// DTO for logout request
export class LogoutDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
