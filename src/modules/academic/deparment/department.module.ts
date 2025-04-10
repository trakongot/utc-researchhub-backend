import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [PrismaModule],
  providers: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
