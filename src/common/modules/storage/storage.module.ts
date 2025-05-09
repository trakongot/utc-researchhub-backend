import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageController } from './storage.controller';
import { StorageService, StorageConfig } from './storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [StorageController],
  providers: [
    {
      provide: StorageService,
      useFactory: (prisma: PrismaService) => {
        const storageConfig: Partial<StorageConfig> = {
          baseUploadDir: process.env.UPLOAD_DIR || 'uploads',
          baseUrl: process.env.BASE_URL || 'http://localhost:4000',
        };

        const configService = new ConfigService(storageConfig as Record<string, unknown>);
        return new StorageService(prisma, configService);
      },
      inject: [PrismaService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
