import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { ProposalOutlineController } from './proposal-outline.controller';
import { ProposalOutlineService } from './proposal-outline.service';

@Module({
  providers: [ProposalOutlineService, PrismaService],
  controllers: [ProposalOutlineController],
})
export class ProposalOutlineModule {}
