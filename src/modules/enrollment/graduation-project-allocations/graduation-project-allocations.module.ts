import { Module } from '@nestjs/common';
import { GraduationProjectAllocationsController } from './graduation-project-allocations.controller';
import { GraduationProjectAllocationsService } from './graduation-project-allocations.service';

@Module({
  imports: [],
  controllers: [GraduationProjectAllocationsController],
  providers: [GraduationProjectAllocationsService],
})
export class GraduationProjectAllocationsModule {}
