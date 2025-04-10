import { FileT } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadFileSchema = z.object({
  description: z.string().optional(),
});

const updateFileSchema = z.object({
  isArchived: z.boolean().optional().default(false),
  description: z.string().optional(),
});

const uploadAvatarSchema = z.object({
  file: z
    .instanceof(Buffer)
    .refine((file) => {
      if (!file || typeof file !== 'object') return false;
      return (file as any).mimetype?.startsWith('image/');
    }, {
      message: 'Only image files are allowed',
    })
    .refine((file) => {
      if (!file || typeof file !== 'object') return false;
      return (file as any).size <= MAX_FILE_SIZE;
    }, {
      message: `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }),
});

const uploadProposalSchema = z.object({
  proposalOutlineId: z.string().uuid().optional(),
});

const uploadProjectReportSchema = z.object({
  fileType: z.nativeEnum(FileT, {
    errorMap: () => ({ message: 'Loại file không hợp lệ' }),
  }),
  description: z.string().optional(),
  projectFinalReportId: z.string().uuid().optional(),
});

const fileResponseSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  size: z.number(),
  mimeType: z.string(),
  path: z.string(),
  url: z.string(),
});

const projectReportFileSchema = z.object({
  id: z.string().uuid(),
  finalReportId: z.string().uuid(),
  fileType: z.nativeEnum(FileT),
  fileUrl: z.string(),
  fileSize: z.number().optional(),
  isArchived: z.boolean(),
  description: z.string().optional().nullable(),
  uploadedById: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class UploadFileDto extends createZodDto(uploadFileSchema) {}
export class UpdateFileDto extends createZodDto(updateFileSchema) {}
export class UploadAvatarDto extends createZodDto(uploadAvatarSchema) {}
export class UploadProposalDto extends createZodDto(uploadProposalSchema) {}
export class UploadProjectReportDto extends createZodDto(
  uploadProjectReportSchema,
) {}
export class FileResponseDto extends createZodDto(fileResponseSchema) {}
export class ProjectReportFileDto extends createZodDto(
  projectReportFileSchema,
) {}
