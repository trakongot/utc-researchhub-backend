import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './common/modules/storage/storage.module';
import { DepartmentModule } from './modules/academic/deparment/department.module';
import { DomainModule } from './modules/academic/domain/domain.module';
import { FieldPoolModule } from './modules/academic/field-pool/field-pool.module';
import { AuthModule } from './modules/auth/auth.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { EnrollmentModule } from './modules/enrollment/entrollment.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CollaborationModule,
    EnrollmentModule,
    DepartmentModule,
    DomainModule,
    StorageModule,
    EvaluationModule,
    UserModule,
    FieldPoolModule,
    CollaborationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
