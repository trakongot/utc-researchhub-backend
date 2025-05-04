import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { ProjectAllocationController } from './project-allocation.controller';
import { ProjectAllocationService } from './project-allocation.service';

@Module({
  imports: [PrismaModule],
  providers: [ProjectAllocationService],
  controllers: [ProjectAllocationController],
  exports: [ProjectAllocationService],
})
export class ProjectAllocationModule {}
