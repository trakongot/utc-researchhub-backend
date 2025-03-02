import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldModule } from './modules/academic/field/field.module';
import { GraduationProjectAllocationsModule } from './modules/enrollment/graduation-project-allocations/graduation-project-allocations.module';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-preferences';
import { StudentAdvisingPreferencesModule } from './modules/enrollment/student-advising-preferences/student-advising-preferences.module';
import { StudentModule } from './modules/user/students';
import { LecturerModule } from './modules/user/lecturers';
import { DepartmentModule } from './modules/academic/deparment';

@Module({
  imports: [
    LecturerPreferencesModule,
    FieldModule,
    GraduationProjectAllocationsModule,
    StudentAdvisingPreferencesModule,
    StudentModule,
    LecturerModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
