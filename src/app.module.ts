import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DraftTopicModule } from './modules/draft-topic/draft-topic.module';

@Module({
  imports: [DraftTopicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
