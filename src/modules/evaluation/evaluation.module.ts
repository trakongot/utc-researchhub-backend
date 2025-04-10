import { Module } from '@nestjs/common';
import { CriteriaModule } from './criteria/criteria.module';
@Module({
  imports: [CriteriaModule],
  exports: [CriteriaModule],
})
export class EvaluationModule {}
