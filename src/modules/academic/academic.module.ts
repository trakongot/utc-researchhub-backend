import { Module } from '@nestjs/common';
import { DepartmentModule } from './deparment/department.module';
import { DomainModule } from './domain/domain.module';
import { FieldPoolModule } from './field-pool/field-pool.module';

@Module({
  imports: [FieldPoolModule, DomainModule, DepartmentModule],
  providers: [FieldPoolModule, DomainModule, DepartmentModule],
})
export class AcademicModule {}
