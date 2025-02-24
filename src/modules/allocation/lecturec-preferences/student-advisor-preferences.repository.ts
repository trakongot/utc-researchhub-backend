import { Injectable, NotFoundException } from '@nestjs/common';
import { LecturecPreferences } from '@prisma/client';
import prisma from 'src/components/prisma';
import { CreateLecturecPreferencesDto } from './dto';
import { ILecturecPreferencesRepository } from './inteface';
const lecturecPreferencesSelect = {
  id: true,
  position: true,
  field: true,
  subField: true,
  topicTitle: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  lecturer: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
};

@Injectable()
export class LecturecPreferencesPrismaRepository
  implements ILecturecPreferencesRepository
{
  constructor() {}

  async get(id: string): Promise<LecturecPreferences | null> {
    return prisma.lecturecPreferences.findUnique({
      where: { id },
      include: { lecturer: true },
    });
  }

  async listByLecturer(lecturerId: string): Promise<LecturecPreferences[]> {
    return prisma.lecturecPreferences.findMany({
      where: { lecturerId },
      include: { lecturer: true },
    });
  }

  async searchByField(field: string): Promise<LecturecPreferences[]> {
    return prisma.lecturecPreferences.findMany({
      where: { field: { contains: field, mode: 'insensitive' } },
      include: { lecturer: true },
    });
  }

  async insert(dto: LecturecPreferences): Promise<void> {
    await prisma.lecturecPreferences.create({ data: dto });
  }

  async update(
    id: string,
    dto: Partial<CreateLecturecPreferencesDto>,
  ): Promise<void> {
    try {
      await prisma.lecturecPreferences.update({
        where: { id },
        data: { ...dto, updatedAt: new Date() },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`id:${id} không tồn tại`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.lecturecPreferences.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`id:${id} không tồn tại`);
      }
      throw error;
    }
  }
}
