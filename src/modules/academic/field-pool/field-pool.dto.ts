import { Prisma } from '@prisma/client';
import { errorMessages } from 'src/common/filters/errors-constants';
import {
  stringToDate,
  stringToNumber,
  stringToObject,
} from 'src/common/filters/zod-utils';
import { z } from 'zod';

type FieldPoolCreateInput = Omit<Prisma.FieldPoolCreateInput, 'id'>;
type FieldPoolUpdateInput = Partial<FieldPoolCreateInput>;

export const FieldPoolSchema = z.object({
  id: z.string().uuid(errorMessages.invalidUUID),
  name: z
    .string()
    .min(2, errorMessages.minLength('Tên lĩnh vực', 2))
    .max(255, errorMessages.maxLength('Tên lĩnh vực', 255)),
  description: z.string().max(500),
  registrationDeadline: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type FieldPool = z.infer<typeof FieldPoolSchema>;

export const FieldPoolUpdateSchema = FieldPoolSchema.partial();
export type FieldPoolUpdate = z.infer<typeof FieldPoolUpdateSchema>;

export const createFieldPoolSchema = FieldPoolSchema.pick({
  name: true,
  description: true,
  registrationDeadline: true,
}).required({
  name: true,
});

export type createFieldPoolDto = z.infer<typeof createFieldPoolSchema> &
  FieldPoolCreateInput;

const FilterValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.date(),
  z.array(z.string()),
  z.array(z.number()),
]);

export const findFieldPoolDtoSchema = FieldPoolSchema.pick({
  name: true,
})
  .extend({
    domain: z.string(),
    department: z.string(),
    departmentId: z.string(),
    status: z.enum(['OPEN', 'CLOSED', 'HIDDEN'], {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    }),
    search: z.string(),
    page: stringToNumber('Số trang')
      .pipe(z.number().min(1, errorMessages.required('Số trang')))

      .default('1'),
    limit: stringToNumber('Số lượng mỗi trang')
      .pipe(
        z.number().max(100, errorMessages.maxLength('Số lượng mỗi trang', 100)),
      )
      .default('20'),
    orderBy: z.enum(['createdAt', 'updatedAt', 'name'], {
      errorMap: () => ({ message: errorMessages.invalidOrderBy }),
    }),
    asc: z.enum(['asc', 'desc'], {
      errorMap: () => ({ message: errorMessages.invalidSortDir }),
    }),
    filters: stringToObject('filters'),
    startDate: stringToDate('startDate'),
    endDate: stringToDate('endDate'),
  })
  .partial();

export type FindFieldPoolDto = z.infer<typeof findFieldPoolDtoSchema>;

export const updateFieldPoolSchema = createFieldPoolSchema.partial();
export type UpdateFieldPoolDto = z.infer<typeof updateFieldPoolSchema> &
  FieldPoolUpdateInput;
