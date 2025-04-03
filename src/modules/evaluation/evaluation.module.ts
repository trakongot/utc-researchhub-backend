import { Module } from '@nestjs/common';
import { EvaluationCriteriaModule } from './evaluation-criteria/evaluation-criteria.module';
import { ProjectEvaluationModule } from './project-evaluation/project-evaluation.module';

@Module({
  imports: [ProjectEvaluationModule, EvaluationCriteriaModule],
  exports: [ProjectEvaluationModule, EvaluationCriteriaModule],
})
export class EvaluationModule {}
