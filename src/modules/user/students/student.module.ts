import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';

@Module({
  imports: [],
  providers: [StudentService, StudentRepository],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
