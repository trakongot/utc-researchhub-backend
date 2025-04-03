import { errorMessages } from 'src/common/filters/errors-constants';
import { stringToNumber } from 'src/common/filters/zod-utils';
import { z } from 'zod';

export const BaseProposalOutlineDto = z.object({
  introduction: z.string().min(10, errorMessages.minLength('Giới thiệu', 10)),

  objectives: z.string().min(10, errorMessages.minLength('Mục tiêu', 10)),

  methodology: z.string().min(10, errorMessages.minLength('Phương pháp', 10)),

  expectedResults: z
    .string()
    .min(10, errorMessages.minLength('Kết quả mong đợi', 10)),

  fileUrl: z.string().url(errorMessages.invalidUrl),

  fileSize: z.number().optional(),

  status: z
    .enum(['PENDING_REVIEW', 'APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    })
    .default('PENDING_REVIEW'),

  createdById: z.string().uuid(errorMessages.invalidUUID),

  creatorType: z.enum(['STUDENT', 'FACULTY'], {
    errorMap: () => ({ message: errorMessages.invalidUserType }),
  }),
});

export type BaseProposalOutlineDto = z.infer<typeof BaseProposalOutlineDto>;

export const CreateProposalOutlineDto = BaseProposalOutlineDto.extend({
  createdAt: z.string().optional(),

  updatedAt: z.string().optional(),
});

export type CreateProposalOutlineDto = z.infer<typeof CreateProposalOutlineDto>;

export const UpdateProposalOutlineDto = BaseProposalOutlineDto.extend({
  introduction: z
    .string()
    .min(10, errorMessages.minLength('Giới thiệu', 10))
    .optional(),
  objectives: z
    .string()
    .min(10, errorMessages.minLength('Mục tiêu', 10))
    .optional(),
  methodology: z
    .string()
    .min(10, errorMessages.minLength('Phương pháp', 10))
    .optional(),
  expectedResults: z
    .string()
    .min(10, errorMessages.minLength('Kết quả mong đợi', 10))
    .optional(),
  fileUrl: z.string().url(errorMessages.invalidUrl).optional(),
  fileSize: z.number().optional(),
  status: z
    .enum(['PENDING_REVIEW', 'APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    })
    .optional(),
});

export type UpdateProposalOutlineDto = z.infer<typeof UpdateProposalOutlineDto>;

export const FindProposalOutlineDto = z.object({
  createdById: z.string().uuid(errorMessages.invalidUUID).optional(),
  creatorType: z
    .enum(['STUDENT', 'FACULTY'], {
      errorMap: () => ({ message: errorMessages.invalidUserType }),
    })
    .optional(),
  status: z
    .enum(['PENDING_REVIEW', 'APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    })
    .optional(),
  page: stringToNumber('Số trang')
    .pipe(z.number().min(1, errorMessages.required('Số trang')))
    .default('1'),
  limit: stringToNumber('Số lượng mỗi trang')
    .pipe(
      z.number().max(100, errorMessages.maxLength('Số lượng mỗi trang', 100)),
    )
    .default('20'),
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
});

export type FindProposalOutlineDto = z.infer<typeof FindProposalOutlineDto>;

export const AutoProposeDto = z.object({
  departmentId: z.string().uuid(errorMessages.invalidUUID).optional(),
});

export type AutoProposeDto = z.infer<typeof AutoProposeDto>;

export const ApproveAllocationDto = z.object({
  projectId: z.string().uuid(errorMessages.invalidUUID),
  status: z.enum(
    ['APPROVED_BY_HEAD', 'REJECTED_BY_HEAD', 'REQUESTED_CHANGES_HEAD'],
    {
      errorMap: () => ({ message: errorMessages.invalidStatus }),
    },
  ),
});

export type ApproveAllocationDto = z.infer<typeof ApproveAllocationDto>;
