import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { EvaluationCriteriaController } from './evaluation-criteria.controller';
import { EvaluationCriteriaService } from './evaluation-criteria.service';

@Module({
  controllers: [EvaluationCriteriaController],
  providers: [EvaluationCriteriaService, PrismaService],
  exports: [EvaluationCriteriaService],
})
export class EvaluationCriteriaModule {}
