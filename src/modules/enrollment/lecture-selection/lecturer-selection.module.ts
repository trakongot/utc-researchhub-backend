import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { LecturerSelectionController } from './lecturer-selection.controller';
import { LecturerSelectionService } from './lecturer-selection.service';

@Module({
  providers: [LecturerSelectionService, PrismaService],
  controllers: [LecturerSelectionController],
})
export class LecturerPreferencesModule {}
