import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { teachers, students, dailyRecords, quranErrors } from "../shared/schema";
import type { Teacher, InsertTeacher, Student, InsertStudent, DailyRecord, InsertDailyRecord, QuranError, InsertQuranError } from "../shared/schema";
import { eq } from "drizzle-orm";

// إنشاء اتصال قاعدة البيانات
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Teachers
  async getTeacher(id: string): Promise<Teacher | undefined> {
    const result = await db.select().from(teachers).where(eq(teachers.id, id)).limit(1);
    return result[0];
  }

  async getTeacherByUsername(username: string): Promise<Teacher | undefined> {
    const result = await db.select().from(teachers).where(eq(teachers.username, username)).limit(1);
    return result[0];
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const result = await db.insert(teachers).values(teacher).returning();
    return result[0];
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0];
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.teacherId, teacherId));
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(student).returning();
    return result[0];
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const result = await db.update(students).set(student).where(eq(students.id, id)).returning();
    return result[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      await db.delete(students).where(eq(students.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Daily Records
  async getDailyRecord(id: string): Promise<DailyRecord | undefined> {
    const result = await db.select().from(dailyRecords).where(eq(dailyRecords.id, id)).limit(1);
    return result[0];
  }

  async getDailyRecordsByStudent(studentId: string): Promise<DailyRecord[]> {
    return await db.select().from(dailyRecords).where(eq(dailyRecords.studentId, studentId));
  }

  async getDailyRecordsByTeacher(teacherId: string): Promise<DailyRecord[]> {
    return await db.select().from(dailyRecords).where(eq(dailyRecords.teacherId, teacherId));
  }

  async createDailyRecord(record: InsertDailyRecord): Promise<DailyRecord> {
    const result = await db.insert(dailyRecords).values(record).returning();
    return result[0];
  }

  async updateDailyRecord(id: string, record: Partial<InsertDailyRecord>): Promise<DailyRecord | undefined> {
    const result = await db.update(dailyRecords).set(record).where(eq(dailyRecords.id, id)).returning();
    return result[0];
  }

  async deleteDailyRecord(id: string): Promise<boolean> {
    try {
      await db.delete(dailyRecords).where(eq(dailyRecords.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Quran Errors
  async getQuranErrorsByStudent(studentId: string): Promise<QuranError[]> {
    return await db.select().from(quranErrors).where(eq(quranErrors.studentId, studentId));
  }

  async createQuranError(error: InsertQuranError): Promise<QuranError> {
    const result = await db.insert(quranErrors).values(error).returning();
    return result[0];
  }

  async deleteQuranError(id: string): Promise<boolean> {
    try {
      await db.delete(quranErrors).where(eq(quranErrors.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Authentication
  async validateTeacher(username: string, password: string): Promise<Teacher | null> {
    const teacher = await this.getTeacherByUsername(username);
    if (teacher && teacher.password === password) {
      return teacher;
    }
    return null;
  }
}