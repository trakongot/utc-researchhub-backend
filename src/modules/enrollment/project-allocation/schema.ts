import { errorMessages } from 'src/common/constant/errors';
import { stringToNumber } from 'src/common/pipe/zod-custom';
import { z } from 'zod';

export const projectAllocationSchema = z.object({
  id: z.string().uuid(errorMessages.invalidUUID),
  topicTitle: z.string().min(3, errorMessages.minLength('Tên đề tài', 3)),
  allocatedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  studentId: z.string().uuid(errorMessages.invalidUUID),
  lecturerId: z.string().uuid(errorMessages.invalidUUID),
});

export type ProjectAllocations = z.infer<typeof projectAllocationSchema>;

export const createProjectAllocationDtoSchema = projectAllocationSchema
  .pick({
    studentId: true,
    lecturerId: true,
    topicTitle: true,
  })
  .required({
    studentId: true,
    lecturerId: true,
    topicTitle: true,
  });

export type CreateProjectAllocationDto = z.infer<
  typeof createProjectAllocationDtoSchema
>;

export const findProjectAllocationDtoSchema = projectAllocationSchema
  .pick({
    studentId: true,
    lecturerId: true,
    topicTitle: true,
  })
  .extend({
    allocatedAtStart: z.date().optional(),
    allocatedAtEnd: z.date().optional(),
    createdAtStart: z.date().optional(),
    createdAtEnd: z.date().optional(),
    updatedAtStart: z.date().optional(),
    updatedAtEnd: z.date().optional(),
    orderBy: z
      .enum(['allocatedAt', 'createdAt', 'updatedAt'], {
        errorMap: () => ({ message: errorMessages.invalidOrderBy }),
      })
      .optional(),
    asc: z
      .enum(['asc', 'desc'], {
        errorMap: () => ({ message: errorMessages.invalidSortDir }),
      })
      .optional(),
    lastId: z.string().uuid(errorMessages.invalidUUID).optional(),
    departmentId: z.string().uuid(errorMessages.invalidUUID).optional(),
    page: stringToNumber('Số trang')
      .pipe(z.number().min(1, errorMessages.required('Số trang')))
      .default('1'),
    limit: stringToNumber('Số lượng mỗi trang')
      .pipe(
        z.number().max(100, errorMessages.maxLength('Số lượng mỗi trang', 100)),
      )
      .default('20'),
  });

export type FindProjectAllocationDto = z.infer<
  typeof findProjectAllocationDtoSchema
>;

export const updateProjectAllocationDtoSchema =
  projectAllocationSchema.partial();

export type UpdateProjectAllocationDto = z.infer<
  typeof updateProjectAllocationDtoSchema
>;
