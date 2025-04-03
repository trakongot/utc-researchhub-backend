import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
@Module({
  providers: [StudentService, PrismaService],
  controllers: [StudentController],
})
export class StudentModule {}
