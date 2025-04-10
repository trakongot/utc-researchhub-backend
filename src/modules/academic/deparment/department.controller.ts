import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipe/zod-validation.pipe';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDto,
  createDepartmentDtoSchema,
  UpdateDepartmentDto,
  updateDepartmentDtoSchema,
} from './schema';
@ApiTags('Departments')
@Controller('/departments')
@ApiBearerAuth('access-token')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @ApiBody({ type: CreateDepartmentDto })
  //   ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Request was successful and the resource was retrieved.',
  //   type: responseClass,
  // }),
  // @ApiResponseSwaggerDecorators.Created<UpdateDepartmentDto>()
  async create(
    @Body(new ZodValidationPipe(createDepartmentDtoSchema))
    dto: CreateDepartmentDto,
  ) {
    return await this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get department by ID',
    description: 'Retrieves department details by ID',
  })
  @ApiParam({ name: 'id', description: 'Department ID' })
  // @ApiResponseSwaggerDecorators.Get<Department>()
  async get(@Param('id') id: string) {
    return await this.service.get(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List departments',
    description: 'Retrieves a paginated list of departments',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  // @ApiResponseSwaggerDecorators.Get<Department[]>()
  async list(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return await this.service.list(page, limit);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update department',
    description: 'Updates department information',
  })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiBody({ description: 'Updated department data' })
  // @ApiResponseSwaggerDecorators.Updated<Department>()
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDepartmentDtoSchema))
    dto: UpdateDepartmentDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete department',
    description: 'Deletes a department',
  })
  @ApiParam({ name: 'id', description: 'Department ID' })
  // @ApiResponseSwaggerDecorators.Deleted<Department>()
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
