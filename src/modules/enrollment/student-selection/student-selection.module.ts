import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { StudentSelectionController } from './student-selection.controller';
import { StudentSelectionService } from './student-selection.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentSelectionController],
  providers: [StudentSelectionService],
})
export class StudentAdvisingPreferencesModule {}
