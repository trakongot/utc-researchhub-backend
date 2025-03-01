import { z } from "zod";
import { graduationProjectAllocationsSchema } from "../schema";

export const createGraduationProjectAllocationsDtoSchema =
  graduationProjectAllocationsSchema
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

export type CreateGraduationProjectAllocationsDto = z.infer<
  typeof createGraduationProjectAllocationsDtoSchema
>;
