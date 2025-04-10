import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
  imports: [PrismaModule],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
