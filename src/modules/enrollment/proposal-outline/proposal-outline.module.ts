import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { ProposalOutlineController } from './proposal-outline.controller';
import { ProposalOutlineService } from './proposal-outline.service';

@Module({
  imports: [PrismaModule],
  providers: [ProposalOutlineService],
  controllers: [ProposalOutlineController],
})
export class ProposalOutlineModule {}
