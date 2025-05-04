import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { errorMessages } from 'src/common/constant/errors';
import { stringToNumber } from 'src/common/pipe/zod-custom';
import { z } from 'zod';

export const projectAllocationSchema = z.object({
  id: z.string().uuid(errorMessages.invalidUUID),
  topicTitle: z.string().min(3, errorMessages.minLength('Tiêu đề đề tài', 3)),
  allocatedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  studentId: z.string().uuid(errorMessages.invalidUUID),
  createdById: z.string().uuid(errorMessages.invalidUUID),
  lecturerId: z.string().uuid(errorMessages.invalidUUID),
});

export type ProjectAllocationType = z.infer<typeof projectAllocationSchema>;

export const createProjectAllocationDtoSchema = projectAllocationSchema
  .pick({
    topicTitle: true,
    studentId: true,
    lecturerId: true,
  })
  .required();

export class CreateProjectAllocationDto extends createZodDto(
  createProjectAllocationDtoSchema,
) {
  @ApiProperty({
    description: 'Tiêu đề đề tài',
    example: 'Xây dựng hệ thống quản lý đề tài nghiên cứu',
  })
  topicTitle: string;

  @ApiProperty({
    description: 'ID của sinh viên',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  studentId: string;

  @ApiProperty({
    description: 'ID của giảng viên hướng dẫn',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  lecturerId: string;
}

export const bulkAllocationsDataSchema = z.array(
  createProjectAllocationDtoSchema,
);

export class BulkAllocationsDataDto extends createZodDto(
  bulkAllocationsDataSchema,
) {
  @ApiProperty({
    description: 'Danh sách các phân công đề tài',
    type: [CreateProjectAllocationDto],
  })
  allocations: CreateProjectAllocationDto[];
}

export const findProjectAllocationDtoSchema = z
  .object({
    studentId: z.string().uuid(errorMessages.invalidUUID),
    lecturerId: z.string().uuid(errorMessages.invalidUUID),
    keyword: z.string(),
    departmentId: z.string().uuid(errorMessages.invalidUUID),
    orderBy: z
      .enum([
        'createdAt',
        'updatedAt',
        'allocatedAt',
        'topicTitle',
        'studentName',
        'lecturerName',
      ])
      .default('allocatedAt'),
    asc: z.enum(['asc', 'desc']).default('desc'),
    page: stringToNumber('Số trang').default('1').pipe(z.number().int().min(1)),
    limit: stringToNumber('Số lượng mỗi trang')
      .default('10')
      .pipe(z.number().int().min(1).max(100)),
  })
  .partial();

export class FindProjectAllocationDto extends createZodDto(
  findProjectAllocationDtoSchema,
) {
  @ApiProperty({
    description: 'ID của sinh viên',
    required: false,
  })
  studentId?: string;

  @ApiProperty({
    description: 'ID của giảng viên hướng dẫn',
    required: false,
  })
  lecturerId?: string;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm (tên sinh viên, tên giảng viên, tiêu đề)',
    required: false,
  })
  keyword?: string;

  @ApiProperty({
    description: 'ID của khoa',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({
    description: 'Sắp xếp theo',
    enum: [
      'createdAt',
      'updatedAt',
      'allocatedAt',
      'topicTitle',
      'studentName',
      'lecturerName',
    ],
    required: false,
    default: 'allocatedAt',
  })
  orderBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'allocatedAt'
    | 'topicTitle'
    | 'studentName'
    | 'lecturerName';

  @ApiProperty({
    description: 'Thứ tự sắp xếp',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  asc?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Số trang',
    required: false,
    type: Number,
    default: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    required: false,
    type: Number,
    default: 10,
  })
  limit?: number;
}

export const updateProjectAllocationDtoSchema = projectAllocationSchema
  .pick({
    topicTitle: true,
    lecturerId: true,
  })
  .partial();

export class UpdateProjectAllocationDto extends createZodDto(
  updateProjectAllocationDtoSchema,
) {
  @ApiProperty({
    description: 'Tiêu đề đề tài',
    required: false,
  })
  topicTitle?: string;

  @ApiProperty({
    description: 'ID của giảng viên hướng dẫn',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  lecturerId?: string;
}

export const recommendationExportDtoSchema = z.object({
  format: z.enum(['json', 'excel']).default('excel'),
  departmentId: z.string().uuid(errorMessages.invalidUUID).optional(),
  maxStudentsPerLecturer: stringToNumber('Số sinh viên tối đa mỗi giảng viên')
    .pipe(z.number().int().positive())
    .optional(),
});

export class RecommendationExportDto extends createZodDto(
  recommendationExportDtoSchema,
) {
  @ApiProperty({
    description: 'Định dạng output (json hoặc excel)',
    enum: ['json', 'excel'],
    required: false,
    default: 'excel',
  })
  format: 'json' | 'excel';

  @ApiProperty({
    description: 'Lọc đề xuất theo ID khoa (tùy chọn)',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({
    description:
      'Số sinh viên tối đa cho mỗi giảng viên (ghi đè giá trị mặc định)',
    type: Number,
    required: false,
    example: 5,
  })
  maxStudentsPerLecturer?: number;
}

export const allocationUploadRequestSchema = z.object({
  departmentId: z.string().uuid(errorMessages.invalidUUID).optional(),
});

export class AllocationUploadRequestDto extends createZodDto(
  allocationUploadRequestSchema,
) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Excel file containing allocations.',
  })
  file: any;

  @ApiProperty({
    description:
      'ID của khoa để giới hạn và kiểm tra phân công (nếu bỏ qua, không kiểm tra khoa)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  departmentId?: string;
}

export const bulkCreateProjectAllocationDtoSchema = z.array(
  createProjectAllocationDtoSchema,
);

export const bulkAllocationRequestDtoSchema = z.object({
  file: z.any().optional(),
  format: z.enum(['json', 'excel']).default('excel'),
  allocations: z.array(createProjectAllocationDtoSchema).optional(),
});

export class BulkAllocationRequestDto extends createZodDto(
  bulkAllocationRequestDtoSchema,
) {
  @ApiProperty({
    description: 'File excel hoặc json chứa danh sách phân công',
    type: 'string',
    format: 'binary',
    required: false,
  })
  file?: any;

  @ApiProperty({
    description: 'Định dạng dữ liệu',
    enum: ['json', 'excel'],
    example: 'excel',
    required: false,
  })
  format: 'json' | 'excel';

  @ApiProperty({
    description: 'Danh sách phân công (nếu gửi theo JSON)',
    type: [CreateProjectAllocationDto],
    required: false,
  })
  allocations?: CreateProjectAllocationDto[];
}

export class AllocationRequestDto extends BulkAllocationRequestDto {}
