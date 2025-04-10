import {
  DefenseCommitteeRoleT,
  ProjectEvaluationStatusT,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';

const EvaluationCriteriaSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish(),
  weight: z.number().min(0).max(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid(),
});

const DefenseCommitteeSchema = z.object({
  id: z.string().uuid(),
  ProjectId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish(),
  defenseDate: z.date(),
  status: z.nativeEnum(ProjectEvaluationStatusT),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid(),
});

const DefenseMemberSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(DefenseCommitteeRoleT),
  defenseCommitteeId: z.string().uuid(),
  facultyMemberId: z.string().uuid(),
});

const ProjectEvaluationSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  finalScore: z.number().nullish(),
  status: z.nativeEnum(ProjectEvaluationStatusT),
  evaluatedById: z.string().uuid().nullish(),
  teacherScore: z.number().nullish(),
  committeeAverageScore: z.number().nullish(),
  teacherWeight: z.number().min(0).max(1).nullish(),
  committeeWeight: z.number().min(0).max(1).nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ProjectCriteriaScoreSchema = z.object({
  id: z.string().uuid(),
  projectEvalId: z.string().uuid(),
  criteriaId: z.string().uuid(),
  evaluatorId: z.string().uuid(),
  score: z.number().min(0).max(10),
  comment: z.string().nullish(),
});

// --- DTO Schemas ---

// Criteria DTOs
const CreateEvaluationCriteriaSchema = EvaluationCriteriaSchema.pick({
  name: true,
  description: true,
  weight: true,
}).refine((data) => (data.weight ?? 1.0) >= 0 && (data.weight ?? 1.0) <= 1, {
  message: 'Trọng số phải từ 0 đến 1',
  path: ['weight'],
});

const UpdateEvaluationCriteriaSchema = EvaluationCriteriaSchema.pick({
  name: true,
  description: true,
  weight: true,
})
  .partial()
  .refine(
    (data) => {
      if (data.weight !== undefined) {
        return data.weight >= 0 && data.weight <= 1;
      }
      return true;
    },
    {
      message: 'Trọng số phải từ 0 đến 1',
      path: ['weight'],
    },
  );
export class CreateEvaluationCriteriaDto extends createZodDto(
  CreateEvaluationCriteriaSchema,
) {
  name: string;
  description?: string;
  weight: number;
}
export class UpdateEvaluationCriteriaDto extends createZodDto(
  UpdateEvaluationCriteriaSchema,
) {
  name?: string;
  description?: string | null;
  weight?: number;
}
export class EvaluationCriteriaDto extends createZodDto(
  EvaluationCriteriaSchema,
) {
  id: string;
  name: string;
  description?: string;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
} // Response DTO

// Defense Committee DTOs
const CreateDefenseCommitteeSchema = z.object({
  projectId: z.string().uuid({ message: 'ID dự án không hợp lệ' }),
  name: z.string().min(1, { message: 'Tên hội đồng không được để trống' }),
  description: z.string().optional(),
  defenseDate: z.coerce.date({
    errorMap: () => ({ message: 'Ngày bảo vệ không hợp lệ' }),
  }),
  // memberIds: z.array(z.string().uuid()).optional(), // Consider adding members later
});
const AddDefenseMemberSchema = z.object({
  facultyMemberId: z.string().uuid({ message: 'ID giảng viên không hợp lệ' }),
  role: z.nativeEnum(DefenseCommitteeRoleT, {
    errorMap: () => ({ message: 'Vai trò không hợp lệ' }),
  }),
});
const UpdateDefenseCommitteeSchema = CreateDefenseCommitteeSchema.omit({
  projectId: true,
}).partial();

export class CreateDefenseCommitteeDto extends createZodDto(
  CreateDefenseCommitteeSchema,
) {}
export class AddDefenseMemberDto extends createZodDto(AddDefenseMemberSchema) {}
export class UpdateDefenseCommitteeDto extends createZodDto(
  UpdateDefenseCommitteeSchema,
) {}
// Add Response DTOs for committee if needed

// Scoring DTOs
const SubmitCriteriaScoreSchema = ProjectCriteriaScoreSchema.pick({
  score: true,
  comment: true,
}).extend({
  score: z
    .number()
    .min(0, 'Điểm phải lớn hơn hoặc bằng 0')
    .max(10, 'Điểm phải nhỏ hơn hoặc bằng 10'),
});

const SubmitTeacherScoreSchema = z.object({
  teacherScore: z
    .number()
    .min(0, 'Điểm phải lớn hơn hoặc bằng 0')
    .max(10, 'Điểm phải nhỏ hơn hoặc bằng 10'),
});

export class SubmitCriteriaScoreDto extends createZodDto(
  SubmitCriteriaScoreSchema,
) {}
export class SubmitTeacherScoreDto extends createZodDto(
  SubmitTeacherScoreSchema,
) {}
// Add Response DTOs for scoring/evaluation results if needed
export class ProjectEvaluationResultDto extends createZodDto(
  ProjectEvaluationSchema.extend({
    criteriaScores: z.array(ProjectCriteriaScoreSchema).optional(),
  }),
) {}
