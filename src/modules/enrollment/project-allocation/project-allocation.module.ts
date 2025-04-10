import { Module } from '@nestjs/common';
import { ProjectAllocationController } from './project-allocation.controller';
import { ProjectAllocationService } from './project-allocation.service';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjectAllocationService],
  controllers: [ProjectAllocationController],
})
export class GraduationProjectAllocationsModule {}
