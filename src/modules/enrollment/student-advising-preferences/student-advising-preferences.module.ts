import { Module } from '@nestjs/common';
import { StudentAdvisingPreferencesController } from './student-advising-preferences.controller';
import { StudentAdvisingPreferencesService } from './student-advising-preferences.service';

@Module({
  controllers: [StudentAdvisingPreferencesController],
  providers: [StudentAdvisingPreferencesService],
  exports: [StudentAdvisingPreferencesService],
})
export class StudentAdvisingPreferencesModule {}
