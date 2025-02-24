import { LecturecPreferences } from '@prisma/client';
import { CreateLecturecPreferencesDto } from '../dto/create-lecturec-preferences.dto';

export interface ILecturecPreferencesService {
  get(id: string): Promise<LecturecPreferences | null>;
  listByLecturer(lecturerId: string): Promise<LecturecPreferences[]>;
  searchByField(field: string): Promise<LecturecPreferences[]>;
  create(dto: CreateLecturecPreferencesDto): Promise<string>;
  update(id: string, dto: Partial<CreateLecturecPreferencesDto>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ILecturecPreferencesRepository
  extends ILecturecPreferencesQueryRepository,
    ILecturecPreferencesCommandRepository {}

export interface ILecturecPreferencesQueryRepository {
  get(id: string): Promise<LecturecPreferences | null>;
  listByLecturer(lecturerId: string): Promise<LecturecPreferences[]>;
  searchByField(field: string): Promise<LecturecPreferences[]>;
}

export interface ILecturecPreferencesCommandRepository {
  insert(dto: LecturecPreferences): Promise<void>;
  update(id: string, dto: Partial<CreateLecturecPreferencesDto>): Promise<void>;
  delete(id: string): Promise<void>;
}
