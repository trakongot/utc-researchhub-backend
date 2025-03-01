import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/share/zod-validation.pipe';
import {
  CreateStudentAdvisingPreferencesDto,
  createStudentAdvisingPreferencesDtoSchema,
  FindStudentAdvisingPreferencesDto,
  findStudentAdvisingPreferencesDtoSchema,
  UpdateStudentAdvisingPreferencesDto,
  updateStudentAdvisingPreferencesDtoSchema,
} from './dto';
import { StudentAdvisingPreferencesService } from './student-advising-preferences.service';

@ApiTags('Student Advising Preferences')
@ApiBearerAuth()
@Controller('/student-advising-preferences')
export class StudentAdvisingPreferencesController {
  constructor(private readonly service: StudentAdvisingPreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createStudentAdvisingPreferencesDtoSchema))
    dto: CreateStudentAdvisingPreferencesDto,
  ) {
    return this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get('grouped')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'facultyMemberId', required: false })
  @ApiQuery({ name: 'fieldId', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['createdAt', 'updatedAt'],
  })
  @ApiQuery({ name: 'asc', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'lastId', required: false })
  async searchGroupedByDepartment(
    @Query(new ZodValidationPipe(findStudentAdvisingPreferencesDtoSchema))
    query: FindStudentAdvisingPreferencesDto,
  ) {
    return this.service.searchByField(
      query,
      Number(query.page) || 1,
      Number(query.limit) || 20,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentAdvisingPreferencesDtoSchema))
    dto: UpdateStudentAdvisingPreferencesDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
