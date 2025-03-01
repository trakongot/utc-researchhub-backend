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
  CreateFieldDto,
  createFieldDtoSchema,
  FindFieldDto,
  findFieldDtoSchema,
  UpdateFieldDto,
  updateFieldDtoSchema,
} from './dto';
import { FieldService } from './field.service';

@ApiTags('Fields')
@Controller('/fields')
@ApiBearerAuth()
export class FieldController {
  constructor(private readonly service: FieldService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createFieldDtoSchema)) dto: CreateFieldDto,
    @Request() req: ReqWithRequester,
  ) {
    return await this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    if (!result) throw new Error(`Không tìm thấy lĩnh vực với id: ${id}`);
    return result;
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'parentId', required: false })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['name'] })
  @ApiQuery({ name: 'asc', required: false, enum: ['asc', 'desc', '1'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'lastId', required: false })
  async find(
    @Query(new ZodValidationPipe(findFieldDtoSchema)) query: FindFieldDto,
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
    @Body(new ZodValidationPipe(updateFieldDtoSchema)) dto: UpdateFieldDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Xóa lĩnh vực thành công' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
