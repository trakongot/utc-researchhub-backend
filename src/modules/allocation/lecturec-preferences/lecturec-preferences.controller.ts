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
  Request,
} from '@nestjs/common';
import { LecturecPreferences } from '@prisma/client';
import { ReqWithRequester } from 'src/share';
import { CreateLecturecPreferencesDto } from './dto/create-lecturec-preferences.dto';
import { LecturecPreferencesService } from './lecturec-preferences.service';

@Controller('allocation/lecturec-preferences')
export class LecturecPreferencesController {
  constructor(private readonly service: LecturecPreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateLecturecPreferencesDto,
    @Request() req: ReqWithRequester,
  ): Promise<{ id: string }> {
    const id = await this.service.create(dto);
    return { id };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('id') id: string,
  ): Promise<Omit<LecturecPreferences, 'lecturerId'> | null> {
    return this.service.get(id);
  }

  @Get('lecturer/:lecturerId')
  @HttpCode(HttpStatus.OK)
  async listByLecturer(
    @Param('lecturerId') lecturerId: string,
  ): Promise<LecturecPreferences[]> {
    return this.service.listByLecturer(lecturerId);
  }

  @Get('search/field/:field')
  @HttpCode(HttpStatus.OK)
  async searchByField(
    @Param('field') field: string,
  ): Promise<LecturecPreferences[]> {
    return this.service.searchByField(field);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateLecturecPreferencesDto>,
  ): Promise<void> {
    await this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
