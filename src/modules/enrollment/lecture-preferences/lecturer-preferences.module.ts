import { Module } from '@nestjs/common';
import { LecturerPreferencesController } from './lecturer-preferences.controller';
import { LecturerPreferencesService } from './lecturer-preferences.service';

@Module({
  controllers: [LecturerPreferencesController],
  providers: [LecturerPreferencesService],
  exports: [LecturerPreferencesService],
})
export class LecturerPreferencesModule {}
