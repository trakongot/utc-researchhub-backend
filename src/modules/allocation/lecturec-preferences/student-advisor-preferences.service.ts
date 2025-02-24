import { Inject, Injectable } from '@nestjs/common';
import { LecturecPreferences } from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import { CreateLecturecPreferencesDto } from './dto';
import {
  ILecturecPreferencesRepository,
  ILecturecPreferencesService,
} from './inteface';

@Injectable()
export class LecturecPreferencesService implements ILecturecPreferencesService {
  constructor(
    @Inject('ILecturecPreferencesRepository')
    private readonly lecturecPreferencesRepository: ILecturecPreferencesRepository,
  ) {}

  async get(id: string): Promise<LecturecPreferences | null> {
    return this.lecturecPreferencesRepository.get(id);
  }

  async listByLecturer(lecturerId: string): Promise<LecturecPreferences[]> {
    return this.lecturecPreferencesRepository.listByLecturer(lecturerId);
  }

  async searchByField(field: string): Promise<LecturecPreferences[]> {
    return this.lecturecPreferencesRepository.searchByField(field);
  }

  async create(dto: CreateLecturecPreferencesDto): Promise<string> {
    const id = uuidv7();
    await this.lecturecPreferencesRepository.insert({
      id,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }

  async update(
    id: string,
    dto: Partial<CreateLecturecPreferencesDto>,
  ): Promise<void> {
    await this.lecturecPreferencesRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.lecturecPreferencesRepository.delete(id);
  }
}
