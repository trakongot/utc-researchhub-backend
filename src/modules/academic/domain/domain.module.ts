import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { PrismaService } from 'src/config/database';

@Module({
  providers: [DomainService, PrismaService],
  controllers: [DomainController],
})
export class DomainModule {}
