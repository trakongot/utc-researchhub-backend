import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { StorageModule } from './common/modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    EvaluationModule,
    // AcademicModule,
    UserModule,
    // LecturerPreferencesModule,
    // GraduationProjectAllocationsModule,
    // StudentAdvisingPreferencesModule,
    // ProposalOutlineModule,
    // UserModule,
    // EvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
