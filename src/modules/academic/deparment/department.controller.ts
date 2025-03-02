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
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDto,
  createDepartmentDtoSchema,
} from './dto/create-department.dto';
import {
  UpdateDepartmentDto,
  updateDepartmentDtoSchema,
} from './dto/update-department.dto';

@ApiTags('Departments')
@Controller('/departments')
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createDepartmentDtoSchema))
    dto: CreateDepartmentDto,
    @Request() req: ReqWithRequester,
  ) {
    return await this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    if (!result) throw new Error(`Không tìm thấy khoa với id: ${id}`);
    return result;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số bản ghi trên mỗi trang',
    example: '10',
  })
  async list(@Query('page') page: string, @Query('limit') limit: string) {
    return this.service.listDepartments(Number(page) || 1, Number(limit) || 10);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDepartmentDtoSchema))
    dto: UpdateDepartmentDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Xóa khoa thành công' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
