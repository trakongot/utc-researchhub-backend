import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  providers: [DepartmentService, PrismaService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
