import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { ProjectAllocationController } from './project-allocation.controller';
import { ProjectAllocationService } from './project-allocation.service';

@Module({
  providers: [ProjectAllocationService, PrismaService],
  controllers: [ProjectAllocationController],
})
export class GraduationProjectAllocationsModule {}
