import { Injectable, NotFoundException } from '@nestjs/common';
import { IStudentRepository } from './interface';
import { CreateStudentDtoSchema, UpdateStudentDtoSchema } from './dto';
import { Student } from './schemas';
import prisma from 'src/components/prisma';
import { uuidv4 } from 'uuidv7';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor() {}

  async get(id: string): Promise<Student | null> {
    const student = await prisma.students.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return student;
  }

  async listStudents(): Promise<Student[]> {
    return await prisma.students.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  async insert(createStudentDto: CreateStudentDtoSchema): Promise<void> {
    try {
      await prisma.students.create({
        data: {
          id: uuidv4(),
          ...createStudentDto,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async update(
    id: string,
    dto: Partial<UpdateStudentDtoSchema>,
  ): Promise<void> {
    try {
      await prisma.students.update({
        where: { id: id },
        data: { ...dto, updatedAt: new Date() },
      });
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await prisma.students.update({
        where: { id: id },
        data: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
