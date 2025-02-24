import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DraftTopicModule } from './modules/research';

@Module({
  imports: [DraftTopicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
