import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturecPreferencesModule } from './modules/allocation';
import { AllocationModule } from './modules/allocation/allocation.module';
import { DraftTopicModule } from './modules/research';

@Module({
  imports: [DraftTopicModule, AllocationModule, LecturecPreferencesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
