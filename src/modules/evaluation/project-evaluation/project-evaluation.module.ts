import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { ProjectEvaluationController } from './project-evaluation.controller';
import { ProjectEvaluationService } from './project-evaluation.service';

@Module({
  controllers: [ProjectEvaluationController],
  providers: [ProjectEvaluationService, PrismaService],
  exports: [ProjectEvaluationService],
})
export class ProjectEvaluationModule {}
