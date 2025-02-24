import { Module } from '@nestjs/common';
import { DraftTopicPrismaRepository } from './draft-topic-prisma.repository';
import { DraftTopicController } from './draft-topic.controller';
import { DraftTopicService } from './draft-topic.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [DraftTopicController],
  providers: [DraftTopicService, DraftTopicPrismaRepository, PrismaClient],
  exports: [DraftTopicService],
})
export class DraftTopicModule {}
