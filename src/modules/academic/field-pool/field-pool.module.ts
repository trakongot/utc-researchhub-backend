import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database';
import { FieldPoolController } from './field-pool.controller';
import { FieldPoolService } from './field-pool.service';

@Module({
  controllers: [FieldPoolController],
  providers: [FieldPoolService, PrismaService],
})
export class FieldPoolModule {}
