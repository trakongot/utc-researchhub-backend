// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
// import { PrismaService } from 'src/modules/prisma/prisma.service';
// import { Paginated } from 'src/share';
// import { uuidv7 } from 'uuidv7';
// import { CreateFieldDto } from './dto/create.dto';
// import { FindFieldDto } from './dto/find.dto';
// import { UpdateFieldDto } from './dto/update.dto';

// @Injectable()
// export class StudyFieldService {
//   constructor(private readonly prisma: PrismaService) {}

//   async get(id: string) {
//     return this.prisma.studyField.findUniqueOrThrow({
//       where: { id },
//       include: { subFields: true },
//     });
//   }

//   async searchByField(
//     dto: FindFieldDto,
//     page: number,
//     limit: number,
//   ): Promise<Paginated<any>> {
//     const whereClause: Prisma.StudyFieldWhereInput = {
//       ...(dto.name
//         ? { name: { contains: dto.name, mode: 'insensitive' as const } }
//         : {}),
//       ...(dto.parentId ? { parentId: dto.parentId } : {}),
//     };

//     const orderByField = dto.orderBy || 'name';
//     const orderDirection: Prisma.SortOrder = dto.asc === 'asc' ? 'asc' : 'desc';
//     const orderBy: Prisma.StudyFieldOrderByWithRelationInput[] = [
//       { [orderByField]: orderDirection },
//     ];
//     const skip = (page - 1) * limit;

//     const [data, total] = await Promise.all([
//       this.prisma.studyField.findMany({
//         where: whereClause,
//         take: limit,
//         skip,
//         orderBy,
//       }),
//       this.prisma.studyField.count({ where: whereClause }),
//     ]);

//     return {
//       data,
//       paging: { page, limit },
//       total,
//     };
//   }

//   async create(dto: CreateFieldDto) {
//     const id = uuidv7();
//     return this.prisma.studyField.create({
//       data: {
//         id,
//         name: dto.name,
//         parentId: dto.parentId || null,
//       },
//     });
//   }

//   async update(id: string, dto: UpdateFieldDto) {
//     const existingField = await this.prisma.studyField.findUnique({
//       where: { id },
//     });
//     if (!existingField) {
//       throw new NotFoundException(`Không tìm thấy lĩnh vực với id: ${id}`);
//     }

//     const updatedField = await this.prisma.studyField.update({
//       where: { id },
//       data: {
//         name: dto.name || existingField.name,
//         parentId: dto.parentId || existingField.parentId,
//       },
//     });

//     // this.logger.log(`Đã cập nhật lĩnh vực với id: ${id}`);
//     return updatedField;
//   }

//   async delete(id: string) {
//     const existingField = await this.prisma.studyField.findUnique({
//       where: { id },
//     });
//     if (!existingField) {
//       throw new NotFoundException(`Không tìm thấy lĩnh vực với id: ${id}`);
//     }

//     await this.prisma.studyField.delete({ where: { id } });
//     // this.logger.log(`Đã xóa lĩnh vực với id: ${id}`);
//   }
// }
