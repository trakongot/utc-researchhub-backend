import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldModule } from './modules/academic/field/field.module';
import { GraduationProjectAllocationsModule } from './modules/enrollment/graduation-project-allocations/graduation-project-allocations.module';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-preferences';
import { StudentAdvisingPreferencesModule } from './modules/enrollment/student-advising-preferences/student-advising-preferences.module';

@Module({
  imports: [
    LecturerPreferencesModule,
    FieldModule,
    GraduationProjectAllocationsModule,
    StudentAdvisingPreferencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
