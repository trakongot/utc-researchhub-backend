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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FacultyRoleT } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipe/zod-validation.pipe';
import { generateApiResponse } from 'src/common/response';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FacultyRoleT.DEAN, FacultyRoleT.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentDto })
  async create(
    @Body(new ZodValidationPipe(createDepartmentDtoSchema))
    dto: CreateDepartmentDto,
  ) {
    return generateApiResponse(
      'tạo khoa thành công',
      await this.service.create(dto),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get department by ID',
    description: 'Retrieves department details by ID',
  })
  @ApiParam({ name: 'id', description: 'Department ID' })
  async get(@Param('id') id: string) {
    return generateApiResponse(
      'Lấy thông tin khoa thành công',
      await this.service.get(id),
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
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
  async list(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return await this.service.list(page, limit);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FacultyRoleT.DEAN, FacultyRoleT.DEPARTMENT_HEAD)
  @ApiOperation({
    summary: 'Update department',
    description: 'Updates department information',
  })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiBody({
    type: UpdateDepartmentDto,
    description: 'Updated department data',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDepartmentDtoSchema))
    dto: UpdateDepartmentDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FacultyRoleT.DEAN, FacultyRoleT.DEPARTMENT_HEAD)
  @ApiOperation({
    summary: 'Delete department',
    description: 'Deletes a department',
  })
  @ApiParam({ name: 'id', description: 'Department ID' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
