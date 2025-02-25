import { CreateStudentDtoSchema, UpdateStudentDtoSchema } from '../dto';
import { Student } from '../schemas';

export interface IStudentService {
  get(id: string): Promise<Student | null>;
  listStudents(): Promise<Student[]>;
  insert(dto: Student): Promise<void>;
  update(id: string, dto: Partial<UpdateStudentDtoSchema>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IStudentRepository
  extends IStudentQueryRepository,
    IStudentCommandRepository {}

export interface IStudentQueryRepository {
  get(id: string): Promise<Student | null>;
  listStudents(): Promise<Student[]>;
}

export interface IStudentCommandRepository {
  insert(dto: Student): Promise<void>;
  update(id: string, dto: Partial<UpdateStudentDtoSchema>): Promise<void>;
  delete(id: string): Promise<void>;
}
