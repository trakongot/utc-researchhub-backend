import { errorMessages } from 'src/common/constant/errors';
import { stringToNumber } from 'src/common/pipe/zod-custom';
import { z } from 'zod';

export const studentSelectionSchema = z.object({
  id: z.string().uuid(errorMessages.invalidUUID).optional(),
  preferredAt: z.date({
    errorMap: () => ({ message: errorMessages.invalidDate }),
  }),
  createdAt: z.date({
    errorMap: () => ({ message: errorMessages.invalidDate }),
  }),
  updatedAt: z.date({
    errorMap: () => ({ message: errorMessages.invalidDate }),
  }),
  studentId: z.string().uuid(errorMessages.invalidUUID),
  facultyMemberId: z.string().uuid(errorMessages.invalidUUID),
  fieldId: z.string().uuid(errorMessages.invalidUUID),
});

export type StudentAdvisingPreferences = z.infer<typeof studentSelectionSchema>;

export const createStudentSelectionDtoSchema = studentSelectionSchema
  .pick({
    studentId: true,
    facultyMemberId: true,
    fieldId: true,
  })
  .required({
    studentId: true,
    facultyMemberId: true,
    fieldId: true,
  });

export type CreateStudentSelectionDto = z.infer<
  typeof createStudentSelectionDtoSchema
>;

export const findStudentSelectionDtoSchema = studentSelectionSchema
  .pick({
    studentId: true,
    facultyMemberId: true,
    fieldId: true,
  })
  .extend({
    keyword: z.string().optional(),
    orderBy: z
      .enum(['createdAt', 'updatedAt'], {
        errorMap: () => ({ message: errorMessages.invalidOrderBy }),
      })
      .optional(),
    asc: z
      .enum(['asc', 'desc'], {
        errorMap: () => ({ message: errorMessages.invalidSortDir }),
      })
      .optional(),
    lastId: z.string().uuid(errorMessages.invalidUUID).optional(),
    page: stringToNumber('Số trang')
      .pipe(z.number().min(1, errorMessages.required('Số trang')))
      .default('1'),
    limit: stringToNumber('Số lượng mỗi trang')
      .pipe(
        z.number().max(100, errorMessages.maxLength('Số lượng mỗi trang', 100)),
      )
      .default('20'),
    departmentId: z.string().uuid(errorMessages.invalidUUID).optional(),
  });

export type FindStudentSelectionDto = z.infer<
  typeof findStudentSelectionDtoSchema
>;

export const updateStudentSelectionDtoSchema = studentSelectionSchema.partial();

export type UpdateStudentSelectionDto = z.infer<
  typeof updateStudentSelectionDtoSchema
>;
