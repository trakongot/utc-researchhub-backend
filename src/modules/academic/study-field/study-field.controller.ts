// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   Query,
//   Request,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { ReqWithRequester } from 'src/share';
// import { ZodValidationPipe } from 'src/share/zod-validation.pipe';
// import {
//   CreateFieldDto,
//   createStudyFieldDtoSchema,
//   FindFieldDto,
//   findStudyFieldDtoSchema,
//   UpdateFieldDto,
//   updateStudyFieldDtoSchema,
// } from './dto';
// import { StudyFieldService } from './study-field.service';

// @ApiTags('Study_Fields')
// @Controller('study-field')
// @ApiBearerAuth()
// export class StudyFieldController {
//   constructor(private readonly service: StudyFieldService) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async create(
//     @Body(new ZodValidationPipe(createStudyFieldDtoSchema)) dto: CreateFieldDto,
//     @Request() req: ReqWithRequester,
//   ) {
//     const result = await this.service.create(dto);
//     return {
//       data: result,
//       message: 'Tạo thành công',
//       statusCode: HttpStatus.CREATED,
//     };
//   }

//   @Get(':id')
//   @HttpCode(HttpStatus.OK)
//   async get(@Param('id') id: string) {
//     const result = await this.service.get(id);
//     return {
//       data: result,
//       message: 'Thành công',
//       statusCode: HttpStatus.OK,
//     };
//   }

//   @Get()
//   @HttpCode(HttpStatus.OK)
//   @ApiQuery({ name: 'name', required: false, type: String })
//   @ApiQuery({ name: 'parentId', required: false, type: String })
//   @ApiQuery({ name: 'orderBy', required: false, enum: ['name'] })
//   @ApiQuery({ name: 'asc', required: false, enum: ['asc', 'desc'] })
//   @ApiQuery({ name: 'page', required: false, type: Number })
//   @ApiQuery({ name: 'limit', required: false, type: Number })
//   async find(
//     @Query(new ZodValidationPipe(findStudyFieldDtoSchema)) query: FindFieldDto,
//   ) {
//     const result = await this.service.searchByField(
//       query,
//       Number(query.page) || 1,
//       Number(query.limit) || 20,
//     );
//     return {
//       data: result.data,
//       paging: result.paging,
//       total: result.total,
//       message: 'Thành công',
//       statusCode: HttpStatus.OK,
//     };
//   }

//   @Patch(':id')
//   @HttpCode(HttpStatus.OK)
//   async update(
//     @Param('id') id: string,
//     @Body(new ZodValidationPipe(updateStudyFieldDtoSchema)) dto: UpdateFieldDto,
//     @Request() req: ReqWithRequester,
//   ) {
//     const result = await this.service.update(id, dto);
//     return {
//       data: result,
//       message: 'Cập nhật thành công',
//       statusCode: HttpStatus.OK,
//     };
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async delete(@Param('id') id: string) {
//     await this.service.delete(id);
//   }
// }
