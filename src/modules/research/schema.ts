import { ProjectStatusT, ProposalStatusT } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema for adding a comment
const addCommentSchema = z.object({
  content: z.string().min(1, { message: 'Content cannot be empty' }),
});

// Schema for creating a proposal outline
const createProposalOutlineSchema = z.object({
  introduction: z.string().min(10, { message: 'Introduction is too short' }),
  objectives: z.string().min(10, { message: 'Objectives are too short' }),
  methodology: z.string().min(10, { message: 'Methodology is too short' }),
  expectedResults: z
    .string()
    .min(10, { message: 'Expected results are too short' }),
  fileUrl: z.string().optional(),
});

// Schema for updating a proposal outline
const updateProposalOutlineSchema = z.object({
  introduction: z
    .string()
    .min(10, { message: 'Introduction is too short' })
    .optional(),
  objectives: z
    .string()
    .min(10, { message: 'Objectives are too short' })
    .optional(),
  methodology: z
    .string()
    .min(10, { message: 'Methodology is too short' })
    .optional(),
  expectedResults: z
    .string()
    .min(10, { message: 'Expected results are too short' })
    .optional(),
  status: z.nativeEnum(ProposalStatusT).optional(),
});

// Schema for creating a proposed project
const createProposedProjectSchema = z.object({
  title: z.string().min(5, { message: 'Title is too short' }),
  description: z.string().min(10, { message: 'Description is too short' }),
  proposalOutlineId: z.string().uuid().optional(),
  fieldPoolId: z.string().uuid().optional(),
});

// Schema for updating a project
const updateProjectSchema = z.object({
  title: z.string().min(5, { message: 'Title is too short' }).optional(),
  description: z
    .string()
    .min(10, { message: 'Description is too short' })
    .optional(),
  status: z.nativeEnum(ProjectStatusT).optional(),
  fieldPoolId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  proposalOutlineId: z.string().uuid().optional(),
});

// Schema for adding a project member
const addProjectMemberSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(['STUDENT', 'FACULTY']),
  descRole: z.string().optional(),
});

// Create DTOs from schemas
export class AddCommentDto extends createZodDto(addCommentSchema) {}
export class CreateProposalOutlineDto extends createZodDto(
  createProposalOutlineSchema,
) {}
export class UpdateProposalOutlineDto extends createZodDto(
  updateProposalOutlineSchema,
) {}
export class CreateProposedProjectDto extends createZodDto(
  createProposedProjectSchema,
) {}
export class UpdateProjectDto extends createZodDto(updateProjectSchema) {}
export class AddProjectMemberDto extends createZodDto(addProjectMemberSchema) {}
