import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { StudentSelectionController } from './student-selection.controller';
import { StudentSelectionService } from './student-selection.service';

@Module({
  controllers: [StudentSelectionController],
  providers: [StudentSelectionService, PrismaService],
})
export class StudentAdvisingPreferencesModule {}
