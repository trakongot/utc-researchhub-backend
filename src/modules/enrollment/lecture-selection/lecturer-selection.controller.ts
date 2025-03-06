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
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReqWithRequester } from 'src/share';
import { ZodValidationPipe } from 'src/share/zod-validation.pipe';

import {
  CreateLecturerSelectionDto,
  createLecturerSelectionDtoSchema,
  FindLecturerSelectionDto,
  findLecturerSelectionDtoSchema,
  UpdateLecturerSelectionDto,
  updateLecturerSelectionDtoSchema,
} from './dto';
import { LecturerSelectionService } from './lecturer-selection.service';

@ApiTags('Lecturer Preferences')
@Controller('lecturer-preferences')
@ApiBearerAuth()
export class LecturerSelectionController {
  constructor(private readonly service: LecturerSelectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createLecturerSelectionDtoSchema))
    dto: CreateLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.create(dto, '2');
    return {
      data: result,
      message: 'Tạo thành công',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    return {
      data: result,
      message: 'Thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'fieldId', required: false, type: String })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'lecturerId', required: false, type: String })
  @ApiQuery({ name: 'asc', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['createdAt', 'updatedAt', 'position'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'departmentId', required: false, type: String })
  async find(
    @Query(new ZodValidationPipe(findLecturerSelectionDtoSchema))
    query: FindLecturerSelectionDto,
  ) {
    const result = await this.service.find(
      query,
      Number(query.page) || 1,
      Number(query.limit) || 20,
    );
    return {
      data: result.data,
      paging: result.paging,
      total: result.total,
      message: 'Thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLecturerSelectionDtoSchema))
    dto: UpdateLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.update(id, dto, '2');
    return {
      data: result,
      message: 'Cập nhật thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
