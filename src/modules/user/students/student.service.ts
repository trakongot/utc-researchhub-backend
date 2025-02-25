import { Injectable, NotFoundException } from '@nestjs/common';
import { IStudentService } from './interface';
import { CreateStudentDtoSchema, UpdateStudentDtoSchema } from './dto';
import { Student } from './schemas';
import { StudentRepository } from './student.repository';

@Injectable()
export class StudentService implements IStudentService {
  constructor(private readonly studentRepo: StudentRepository) {}

  /** Lấy thông tin một sinh viên theo ID */
  async get(id: string): Promise<Student | null> {
    try {
      const student = await this.studentRepo.get(id);
      if (!student) {
        throw new NotFoundException(`Sinh viên với id ${id} không tồn tại`);
      }
      return student;
    } catch (error) {
      console.error(`Lỗi khi lấy sinh viên với id ${id}:`, error);
      throw error;
    }
  }

  /** Lấy danh sách tất cả sinh viên */
  async listStudents(): Promise<Student[]> {
    try {
      return await this.studentRepo.listStudents();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
      throw error;
    }
  }

  /** Thêm mới một sinh viên */
  async insert(createStudentDto: CreateStudentDtoSchema): Promise<void> {
    try {
      await this.studentRepo.insert(createStudentDto);
    } catch (error) {
      console.error('Lỗi khi thêm mới sinh viên:', error);
      throw error;
    }
  }

  /** Cập nhật thông tin sinh viên */
  async update(
    id: string,
    updateStudentDto: Partial<UpdateStudentDtoSchema>,
  ): Promise<void> {
    try {
      await this.studentRepo.update(id, updateStudentDto);
    } catch (error) {
      console.error(`Lỗi khi cập nhật sinh viên với id ${id}:`, error);
      throw error;
    }
  }

  /** Xóa một sinh viên */
  async delete(id: string): Promise<void> {
    try {
      await this.studentRepo.delete(id);
    } catch (error) {
      console.error(`Lỗi khi xóa sinh viên với id ${id}:`, error);
      throw error;
    }
  }
}
