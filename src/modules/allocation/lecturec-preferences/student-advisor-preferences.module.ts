import { Module } from "@nestjs/common";
import { LecturecPreferencesController } from "./lecturec-preferences.controller";
import { LecturecPreferencesPrismaRepository } from "./student-advisor-preferences.repository";
import { LecturecPreferencesService } from "./student-advisor-preferences.service";

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
