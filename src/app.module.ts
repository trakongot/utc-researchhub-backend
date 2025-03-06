import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { FieldModule } from './modules/academic/study-field/study-field.module';
import { GraduationProjectAllocationsModule } from './modules/enrollment/project-allocation/project-allocation.module';
import { StudentAdvisingPreferencesModule } from './modules/enrollment/student-selection/student-selection.module';
import { DepartmentModule } from './modules/academic/deparment/department.module';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-selection/lecturer-selection.module';

@Module({
  imports: [
    LecturerPreferencesModule,
    // FieldModule,
    GraduationProjectAllocationsModule,
    StudentAdvisingPreferencesModule,
    DepartmentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
