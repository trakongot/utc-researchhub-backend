import { Module } from '@nestjs/common';
import { LecturecPreferencesController } from './lecturec-preferences.controller';
import { LecturecPreferencesPrismaRepository } from './lecturec-preferences.repository';
import { LecturecPreferencesService } from './lecturec-preferences.service';

@Module({
  controllers: [LecturecPreferencesController],
  providers: [
    {
      provide: 'ILecturecPreferencesRepository',
      useClass: LecturecPreferencesPrismaRepository,
    },
    LecturecPreferencesService,
  ],
  exports: [LecturecPreferencesService],
})
export class LecturecPreferencesModule {}
