import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { FieldPoolController } from './field-pool.controller';
import { FieldPoolService } from './field-pool.service';

@Module({
  imports: [PrismaModule],
  controllers: [FieldPoolController],
  providers: [FieldPoolService],
})
export class FieldPool {}
