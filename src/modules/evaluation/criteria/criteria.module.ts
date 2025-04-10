import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { CriteriaController } from './criteria.controller';
import { CriteriaService } from './criteria.service';

@Module({
  imports: [PrismaModule],
  controllers: [CriteriaController],
  providers: [CriteriaService],
  exports: [CriteriaService],
})
export class CriteriaModule {}
