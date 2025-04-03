import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { FieldModule } from './modules/academic/study-field/study-field.module';
import { AcademicModule } from './modules/academic/academic.module';
import { AuthModule } from './modules/auth/auth.module';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-selection/lecturer-selection.module';
import { GraduationProjectAllocationsModule } from './modules/enrollment/project-allocation/project-allocation.module';
import { ProposalOutlineModule } from './modules/enrollment/proposal-outline/proposal-outline.module';
import { StudentAdvisingPreferencesModule } from './modules/enrollment/student-selection/student-selection.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    AcademicModule,
    AuthModule,
    LecturerPreferencesModule,
    GraduationProjectAllocationsModule,
    StudentAdvisingPreferencesModule,
    ProposalOutlineModule,
    UserModule,
    EvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
