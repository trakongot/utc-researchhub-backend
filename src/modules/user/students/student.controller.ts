import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './schemas';
import { CreateStudentDtoSchema, UpdateStudentDtoSchema } from './dto';

@Controller('/user/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // [GET] /user/students
  @Get()
  async listStudents(): Promise<Student[]> {
    try {
      return await this.studentService.listStudents();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
      throw error;
    }
  }

  // [GET] /user/students/:id
  @Get('/:id')
  async getStudent(@Param('id') id: string): Promise<Student> {
    try {
      const student = await this.studentService.get(id);
      if (!student) {
        throw new NotFoundException(`Sinh viên với id ${id} không tồn tại`);
      }
      return student;
    } catch (error) {
      throw error;
    }
  }

  // [POST] /user/students/add
  @Post('/add')
  async createStudent(
    @Body() createStudentDto: CreateStudentDtoSchema,
  ): Promise<void> {
    try {
      await this.studentService.insert(createStudentDto);
    } catch (error) {
      console.error('Lỗi khi thêm mới sinh viên:', error);
      throw error;
    }
  }

  // [PATCH] /user/students/edit/:id
  @Patch('/edit/:id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: Partial<UpdateStudentDtoSchema>,
  ): Promise<void> {
    try {
      await this.studentService.update(id, updateStudentDto);
    } catch (error) {
      console.error(`Lỗi khi cập nhật sinh viên với id ${id}:`, error);
      throw error;
    }
  }

  // [DELETE] /user/students/delete/:id
  @Delete('/delete/:id')
  async deleteStudent(@Param('id') id: string): Promise<void> {
    try {
      await this.studentService.delete(id);
    } catch (error) {
      console.error(`Lỗi khi xóa sinh viên với id ${id}:`, error);
      throw error;
    }
  }
}
