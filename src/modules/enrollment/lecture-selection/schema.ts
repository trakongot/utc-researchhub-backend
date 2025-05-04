import { ApiProperty } from '@nestjs/swagger';
import { LecturerSelectionStatusT } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { errorMessages } from 'src/common/constant/errors';
import { stringToBoolean, stringToNumber } from 'src/common/pipe/zod-custom';
import { z } from 'zod';

export const lecturerSelectionSchema = z.object({
  id: z.string().uuid(errorMessages.invalidUUID),
  priority: z.number().min(1, errorMessages.required('Thứ tự ưu tiên')),
  topicTitle: z.string().min(3, errorMessages.minLength('Tiêu đề đề tài', 3)),
  description: z.string().optional().nullable(),
  lecturerId: z.string().uuid(errorMessages.invalidUUID),
  fieldPoolId: z.string().uuid(errorMessages.invalidUUID).optional().nullable(),
  capacity: z.number().min(1, errorMessages.required('Số lượng SV tối đa')),
  currentCapacity: z
    .number()
    .min(0, errorMessages.required('Số lượng SV đã đăng ký'))
    .default(0),
  status: z
    .nativeEnum(LecturerSelectionStatusT, {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    })
    .default(LecturerSelectionStatusT.PENDING),
  isActive: stringToBoolean('Trạng thái hoạt động').default('true'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type LecturerSelection = z.infer<typeof lecturerSelectionSchema>;

export const createLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    priority: true,
    topicTitle: true,
    description: true,
    fieldPoolId: true,
    capacity: true,
  })
  .required({
    priority: true,
    topicTitle: true,
    capacity: true,
  });

export class CreateLecturerSelectionDto extends createZodDto(
  createLecturerSelectionDtoSchema,
) {
  @ApiProperty({
    description: 'Thứ tự ưu tiên',
    example: 1,
  })
  priority: number;

  @ApiProperty({
    description: 'Tiêu đề đề tài',
    example: 'Đề tài 1',
  })
  topicTitle: string;

  @ApiProperty({
    description: 'Mô tả đề tài',
    example: 'Mô tả đề tài',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: 'ID của pool lĩnh vực',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  fieldPoolId?: string | null;

  @ApiProperty({
    description: 'Số lượng SV tối đa',
    example: 10,
  })
  capacity: number;
}

export const findLecturerSelectionDtoSchema = z
  .object({
    lecturerId: z.string().uuid(errorMessages.invalidUUID),
    fieldPoolId: z.string().uuid(errorMessages.invalidUUID),
    status: z.nativeEnum(LecturerSelectionStatusT),
    isActive: stringToBoolean('Trạng thái hoạt động'),
    keyword: z.string(),
    orderBy: z.enum(['createdAt', 'updatedAt', 'priority', 'topicTitle'], {
      errorMap: () => ({ message: errorMessages.invalidOrderBy }),
    }),
    asc: z.enum(['asc', 'desc'], {
      errorMap: () => ({ message: errorMessages.invalidSortDir }),
    }),
    lecturerIds: z.array(z.string().uuid(errorMessages.invalidUUID)),
    page: stringToNumber('Số trang').default('1'),
    limit: stringToNumber('Số lượng mỗi trang').default('10'),
    departmentId: z.string().uuid(errorMessages.invalidUUID),
  })
  .partial();

export class FindLecturerSelectionDto extends createZodDto(
  findLecturerSelectionDtoSchema,
) {
  @ApiProperty({
    description: 'ID của giảng viên',
    required: false,
  })
  lecturerId?: string;

  @ApiProperty({
    description: 'ID của pool lĩnh vực',
    required: false,
  })
  fieldPoolId?: string;

  @ApiProperty({
    description: 'Trạng thái của đề tài',
    enum: LecturerSelectionStatusT,
    required: false,
  })
  status?: LecturerSelectionStatusT;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm',
    required: false,
  })
  keyword?: string;

  @ApiProperty({
    description: 'Sắp xếp theo',
    enum: ['createdAt', 'updatedAt', 'priority', 'topicTitle'],
    required: false,
  })
  orderBy?: 'createdAt' | 'updatedAt' | 'priority' | 'topicTitle';

  @ApiProperty({
    description: 'Hướng sắp xếp',
    enum: ['asc', 'desc'],
    required: false,
  })
  asc?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Danh sách ID giảng viên',
    type: [String],
    required: false,
  })
  lecturerIds?: string[];

  @ApiProperty({
    description: 'Số trang',
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    required: false,
  })
  limit?: number;

  @ApiProperty({
    description: 'ID của khoa',
    required: false,
  })
  departmentId?: string;
}

export const updateLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    priority: true,
    topicTitle: true,
    description: true,
    capacity: true,
    isActive: true,
    fieldPoolId: true,
  })
  .partial();

export class UpdateLecturerSelectionDto extends createZodDto(
  updateLecturerSelectionDtoSchema,
) {
  @ApiProperty({
    description: 'Thứ tự ưu tiên',
    example: 1,
    required: false,
  })
  priority?: number;

  @ApiProperty({
    description: 'Tiêu đề đề tài',
    example: 'Đề tài 1',
    required: false,
  })
  topicTitle?: string;

  @ApiProperty({
    description: 'Mô tả đề tài',
    example: 'Mô tả đề tài',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Số lượng SV tối đa',
    example: 10,
    required: false,
  })
  capacity?: number;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: 'true',
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'ID của pool lĩnh vực',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  fieldPoolId?: string | null;
}

export const updateLecturerSelectionStatusDtoSchema = z
  .object({
    status: z.nativeEnum(LecturerSelectionStatusT, {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    }),
    comment: z.string().optional().nullable(),
  })
  .required({
    status: true,
  });

export class UpdateLecturerSelectionStatusDto extends createZodDto(
  updateLecturerSelectionStatusDtoSchema,
) {
  @ApiProperty({
    description: 'Trạng thái của đề tài',
    enum: LecturerSelectionStatusT,
    example: LecturerSelectionStatusT.APPROVED,
  })
  status: LecturerSelectionStatusT;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'Cập nhật trạng thái',
    required: false,
  })
  comment?: string | null;
}
