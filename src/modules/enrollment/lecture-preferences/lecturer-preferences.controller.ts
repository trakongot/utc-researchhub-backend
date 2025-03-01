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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReqWithRequester } from 'src/share';
import { ZodValidationPipe } from 'src/share/zod-validation.pipe';
import {
  CreateLecturerPreferencesDto,
  createLecturerPreferencesDtoSchema,
  FindLecturerPreferencesDto,
  findLecturerPreferencesDtoSchema,
} from './dto';
import {
  UpdateLecturerPreferencesDto,
  updateLecturerPreferencesDtoSchema,
} from './dto/update-lecturer-preferences.dto';
import { LecturerPreferencesService } from './lecturer-preferences.service';

@ApiTags('Lecturer Preferences')
@Controller('/lecturer-preferences')
@ApiBearerAuth()
export class LecturerPreferencesController {
  constructor(private readonly service: LecturerPreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createLecturerPreferencesDtoSchema))
    dto: CreateLecturerPreferencesDto,
    @Request() req: ReqWithRequester,
  ) {
    return await this.service.create(dto, '1');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    if (!result) throw new Error(`Không tìm thấy preferences với id: ${id}`);
    return result;
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'fieldId', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'lecturerId', required: false })
  @ApiQuery({ name: 'asc', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['createdAt', 'updatedAt', 'position'],
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'lastId', required: false })
  async searchByField(
    @Query(new ZodValidationPipe(findLecturerPreferencesDtoSchema))
    query: FindLecturerPreferencesDto,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.service.searchByField(
      { ...query },
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLecturerPreferencesDtoSchema))
    dto: UpdateLecturerPreferencesDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.update(id, dto, '1');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Xóa preferences thành công' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
