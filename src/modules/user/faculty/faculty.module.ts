import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';

@Module({
  providers: [FacultyService, PrismaService],
  controllers: [FacultyController],
})
export class FacultyModule {}
