import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { User } from '@prisma/client';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLessonDto) {
    try {
      return await this.prisma.lesson.create({ data });
    } catch (error) {
      console.error('Create lesson error:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: {
        schedule: true,
      },
    });
  }

  async findAllByGroupAndDiscipline(groupId: number, disciplineId: number) {
    return this.prisma.lesson.findMany({
      where: { schedule: { groupId: groupId, disciplineId: disciplineId } },
      include: {
        grades: true,
        schedule: { include: { discipline: true, group: true } },
      },
    });
  }

  async findAllByDate(date: string) {
    return this.prisma.lesson.findMany({
      where: { date: date },
      include: {
        grades: true,
        schedule: { include: { discipline: true, group: true, teacher: true } },
        homework: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.lesson.findFirst({ where: { id } });
  }

  async update(id: number, data: Partial<CreateLessonDto>) {
    return await this.prisma.lesson.update({
      where: { id: id },
      data,
    });
  }

async delete(id: number) {
  // Удаляем связанные оценки
  await this.prisma.grade.deleteMany({
    where: { lessonId: id },
  });

  await this.prisma.homework.deleteMany({ where: { lessonId: id } });


  // Удаляем сам урок
  return await this.prisma.lesson.delete({
    where: { id },
  });
}
}
