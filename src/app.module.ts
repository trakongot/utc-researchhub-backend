import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldModule } from './modules/academic/field/field.module';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-preferences';

@Module({
  imports: [LecturerPreferencesModule, FieldModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
