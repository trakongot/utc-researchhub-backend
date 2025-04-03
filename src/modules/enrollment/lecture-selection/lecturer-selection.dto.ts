import { errorMessages } from 'src/common/filters/errors-constants';
import { stringToBoolean, stringToNumber } from 'src/common/filters/zod-utils';
import { z } from 'zod';

export const lecturerSelectionSchema = z.object({
  id: z.string().uuid(errorMessages.invalidUUID),
  position: z.number().min(1, errorMessages.required('Vị trí')),
  studyFieldId: z.string().uuid(errorMessages.invalidUUID),
  topicTitle: z.string().min(3, errorMessages.minLength('Tiêu đề đề tài', 3)),
  description: z.string(),
  lecturerId: z.string().uuid(errorMessages.invalidUUID),
  fieldPoolId: z.string().uuid(errorMessages.invalidUUID),
  capacity: z.number().min(1, errorMessages.required('Số lượng')),

  currentCapacity: z
    .number()
    .min(0, errorMessages.required('Số lượng hiện tại')),
  status: z.enum(
    ['REQUESTED_CHANGES', 'PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED'],
    {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    },
  ),
  isActive: stringToBoolean('Trạng thái'),
});

export type LecturerSelection = z.infer<typeof lecturerSelectionSchema>;

export const createLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    position: true,
    studyFieldId: true,
    topicTitle: true,
    description: true,
    lecturerId: true,
    fieldPoolId: true,
    capacity: true,
    currentCapacity: true,
    status: true,
    isActive: true,
  })
  .required({
    position: true,
    studyFieldId: true,
    topicTitle: true,
    lecturerId: true,
  });

export type CreateLecturerSelectionDto = z.infer<
  typeof createLecturerSelectionDtoSchema
>;

export const findLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    studyFieldId: true,
    lecturerId: true,
    fieldPoolId: true,
    status: true,
    isActive: true,
  })
  .extend({
    keyword: z.string(),
    orderBy: z.enum(['createdAt', 'updatedAt', 'priority'], {
      errorMap: () => ({ message: errorMessages.invalidOrderBy }),
    }),
    asc: z.enum(['asc', 'desc'], {
      errorMap: () => ({ message: errorMessages.invalidSortDir }),
    }),
    lecturerIds: z.array(z.string()),
    studyFieldIds: z.array(z.string()),
    page: stringToNumber('Số trang')
      .pipe(z.number().min(1, errorMessages.required('Số trang')))
      .default('1'),
    limit: stringToNumber('Số lượng mỗi trang')
      .pipe(
        z.number().max(100, errorMessages.maxLength('Số lượng mỗi trang', 100)),
      )
      .default('20'),
    departmentId: z.string().uuid(errorMessages.invalidUUID),
  })
  .partial();
export type FindLecturerSelectionDto = z.infer<
  typeof findLecturerSelectionDtoSchema
>;

export const updateLecturerSelectionDtoSchema = lecturerSelectionSchema
  .pick({
    position: true,
    studyFieldId: true,
    topicTitle: true,
    description: true,
  })
  .partial();

export type UpdateLecturerSelectionDto = z.infer<
  typeof updateLecturerSelectionDtoSchema
>;
