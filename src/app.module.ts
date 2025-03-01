import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturerPreferencesModule } from './modules/enrollment/lecture-preferences';

@Module({
  imports: [LecturerPreferencesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
