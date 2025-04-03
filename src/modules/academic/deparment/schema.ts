// src/dtos/department.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { DepartmentStatusT } from '@prisma/client';
import { errorMessages } from 'src/common/filters/errors-constants';
import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.string(),
  departmentCode: z.string().min(1, errorMessages.required('Mã khoa')),
  name: z.string().min(1, errorMessages.required('Tên khoa')),
  description: z.string().optional(),
  status: z.nativeEnum(DepartmentStatusT).default(DepartmentStatusT.ACTIVE),
  createdAt: z.date({ invalid_type_error: 'Ngày tạo không hợp lệ' }),
  updatedAt: z.date({ invalid_type_error: 'Ngày cập nhật không hợp lệ' }),
  parentDepartmentId: z.string().optional(),
});

// export class Department extends Z.class({
//   id: z.string(),
//   departmentCode: z.string().min(1, errorMessages.required('Mã khoa')),
//   name: z.string().min(1, errorMessages.required('Tên khoa')),
//   description: z.string().optional(),
//   status: z.nativeEnum(DepartmentStatusT).default(DepartmentStatusT.ACTIVE),
//   createdAt: z.date({ invalid_type_error: 'Ngày tạo không hợp lệ' }),
//   updatedAt: z.date({ invalid_type_error: 'Ngày cập nhật không hợp lệ' }),
//   parentDepartmentId: z.string().optional(),
// }) {}
export class Department {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  departmentCode: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, required: false })
  description?: string;

  @ApiProperty({ enum: DepartmentStatusT })
  status: DepartmentStatusT;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: String, required: false })
  parentDepartmentId?: string;

  constructor(init: Department) {
    Object.assign(this, init);
  }
}

export const createDepartmentDtoSchema = departmentSchema.pick({
  departmentCode: true,
  name: true,
  description: true,
  parentDepartmentId: true,
});


export type CreateDepartmentDto = z.infer<typeof createDepartmentDtoSchema>;

export const updateDepartmentDtoSchema = departmentSchema
  .pick({
    departmentCode: true,
    name: true,
    description: true,
    parentDepartmentId: true,
    status: true,
  })
  .partial();

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentDtoSchema>;
