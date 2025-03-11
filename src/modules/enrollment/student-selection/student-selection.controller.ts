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
  CreateStudentSelectionDto,
  createStudentSelectionDtoSchema,
  FindStudentSelectionDto,
  findStudentSelectionDtoSchema,
  UpdateStudentSelectionDto,
  updateStudentSelectionDtoSchema,
} from './dto';
import { StudentSelectionService } from './student-selection.service';

@ApiTags('Student Advising Preferences')
@ApiBearerAuth()
@Controller('/student-advising-preferences')
export class StudentSelectionController {
  constructor(private readonly service: StudentSelectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createStudentSelectionDtoSchema))
    dto: CreateStudentSelectionDto,
  ) {
    return this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  async list(
    @Query(new ZodValidationPipe(findStudentSelectionDtoSchema))
    query: FindStudentSelectionDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    return this.service.find(query, pageNumber, limitNumber);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSelectionDtoSchema))
    dto: UpdateStudentSelectionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
