import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { FieldModule } from './modules/academic/study-field/study-field.module';
import { DepartmentModule } from './modules/academic/deparment/department.module';
import { FieldPool } from './modules/academic/field-pool/field-pool.module';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-selection/lecturer-selection.module';
import { GraduationProjectAllocationsModule } from './modules/enrollment/project-allocation/project-allocation.module';
import { StudentAdvisingPreferencesModule } from './modules/enrollment/student-selection/student-selection.module';

@Module({
  imports: [
    LecturerPreferencesModule,
    FieldPool,
    GraduationProjectAllocationsModule,
    StudentAdvisingPreferencesModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
