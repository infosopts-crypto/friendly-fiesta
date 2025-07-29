import { type Teacher, type InsertTeacher, type Student, type InsertStudent, type DailyRecord, type InsertDailyRecord, type QuranError, type InsertQuranError } from "@shared/schema";
import { randomUUID } from "crypto";
import { SupabaseStorage } from "./supabase-storage";

export interface IStorage {
  // Teachers
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherByUsername(username: string): Promise<Teacher | undefined>;
  getAllTeachers(): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  getStudentsByTeacher(teacherId: string): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  
  // Daily Records
  getDailyRecord(id: string): Promise<DailyRecord | undefined>;
  getDailyRecordsByStudent(studentId: string): Promise<DailyRecord[]>;
  getDailyRecordsByTeacher(teacherId: string): Promise<DailyRecord[]>;
  createDailyRecord(record: InsertDailyRecord): Promise<DailyRecord>;
  updateDailyRecord(id: string, record: Partial<InsertDailyRecord>): Promise<DailyRecord | undefined>;
  deleteDailyRecord(id: string): Promise<boolean>;
  
  // Quran Errors
  getQuranErrorsByStudent(studentId: string): Promise<QuranError[]>;
  createQuranError(error: InsertQuranError): Promise<QuranError>;
  deleteQuranError(id: string): Promise<boolean>;
  
  // Authentication
  validateTeacher(username: string, password: string): Promise<Teacher | null>;
}

export class MemStorage implements IStorage {
  private teachers: Map<string, Teacher>;
  private students: Map<string, Student>;
  private dailyRecords: Map<string, DailyRecord>;
  private quranErrors: Map<string, QuranError>;

  constructor() {
    this.teachers = new Map();
    this.students = new Map();
    this.dailyRecords = new Map();
    this.quranErrors = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Men's circle teachers
    const menTeachers = [
      { username: "abdalrazaq", password: "123456", name: "أ. عبدالرزاق", gender: "male", circleName: "حلقة عبدالرزاق" },
      { username: "ibrahim", password: "123456", name: "أ. إبراهيم كدوائي", gender: "male", circleName: "حلقة إبراهيم كدوائي" },
      { username: "hassan", password: "123456", name: "أ. حسن", gender: "male", circleName: "حلقة حسن" },
      { username: "saud", password: "123456", name: "أ. سعود", gender: "male", circleName: "حلقة سعود" },
      { username: "saleh", password: "123456", name: "أ. صالح", gender: "male", circleName: "حلقة صالح" },
      { username: "abdullah", password: "123456", name: "أ. عبدالله", gender: "male", circleName: "حلقة عبدالله" },
      { username: "nabil", password: "123456", name: "أ. نبيل", gender: "male", circleName: "حلقة نبيل" },
    ];

    // Women's circle teachers
    const womenTeachers = [
      { username: "asma", password: "123456", name: "أ. أسماء", gender: "female", circleName: "حلقة أسماء" },
      { username: "raghad", password: "123456", name: "أ. رغد", gender: "female", circleName: "حلقة رغد" },
      { username: "madina", password: "123456", name: "أ. مدينة", gender: "female", circleName: "حلقة مدينة" },
      { username: "nashwa", password: "123456", name: "أ. نشوة", gender: "female", circleName: "حلقة نشوة" },
      { username: "nour", password: "123456", name: "أ. نور", gender: "female", circleName: "حلقة نور" },
      { username: "hind", password: "123456", name: "أ. هند", gender: "female", circleName: "حلقة هند" },
    ];

    [...menTeachers, ...womenTeachers].forEach(teacherData => {
      const teacher: Teacher = {
        ...teacherData,
        id: randomUUID(),
        createdAt: new Date(),
      };
      this.teachers.set(teacher.id, teacher);
      console.log(`📝 Initialized teacher: ${teacher.username} with password: ${teacher.password}`);
    });

    console.log(`✅ MemStorage initialized with ${this.teachers.size} teachers`);
  }

  // Teachers
  async getTeacher(id: string): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeacherByUsername(username: string): Promise<Teacher | undefined> {
    return Array.from(this.teachers.values()).find(teacher => teacher.username === username);
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = randomUUID();
    const teacher: Teacher = { 
      ...insertTeacher, 
      id,
      createdAt: new Date(),
    };
    this.teachers.set(id, teacher);
    return teacher;
  }



  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(student => student.teacherId === teacherId);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = { 
      ...insertStudent, 
      id,
      createdAt: new Date(),
      phone: insertStudent.phone || null,
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent: Student = { ...student, ...updateData };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<boolean> {
    return this.students.delete(id);
  }

  // Daily Records
  async getDailyRecord(id: string): Promise<DailyRecord | undefined> {
    return this.dailyRecords.get(id);
  }

  async getDailyRecordsByStudent(studentId: string): Promise<DailyRecord[]> {
    return Array.from(this.dailyRecords.values())
      .filter(record => record.studentId === studentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getDailyRecordsByTeacher(teacherId: string): Promise<DailyRecord[]> {
    return Array.from(this.dailyRecords.values())
      .filter(record => record.teacherId === teacherId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createDailyRecord(insertRecord: InsertDailyRecord): Promise<DailyRecord> {
    const id = randomUUID();
    const record: DailyRecord = { 
      ...insertRecord, 
      id,
      createdAt: new Date(),
      behavior: insertRecord.behavior || null,
      other: insertRecord.other || null,
      dailyLesson: insertRecord.dailyLesson || null,
      lessonFromVerse: insertRecord.lessonFromVerse || null,
      lessonToVerse: insertRecord.lessonToVerse || null,
      lastFivePages: insertRecord.lastFivePages || null,
      dailyReview: insertRecord.dailyReview || null,
      reviewFrom: insertRecord.reviewFrom || null,
      reviewTo: insertRecord.reviewTo || null,
      pageCount: insertRecord.pageCount || null,
      errors: insertRecord.errors || null,
      reminders: insertRecord.reminders || null,
      listenerName: insertRecord.listenerName || null,
      totalScore: insertRecord.totalScore || null,
      notes: insertRecord.notes || null,
    };
    this.dailyRecords.set(id, record);
    return record;
  }

  async updateDailyRecord(id: string, updateData: Partial<InsertDailyRecord>): Promise<DailyRecord | undefined> {
    const record = this.dailyRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord: DailyRecord = { ...record, ...updateData };
    this.dailyRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteDailyRecord(id: string): Promise<boolean> {
    return this.dailyRecords.delete(id);
  }

  // Quran Errors
  async getQuranErrorsByStudent(studentId: string): Promise<QuranError[]> {
    return Array.from(this.quranErrors.values()).filter(error => error.studentId === studentId);
  }

  async createQuranError(insertError: InsertQuranError): Promise<QuranError> {
    const id = randomUUID();
    const error: QuranError = { 
      ...insertError, 
      id,
      createdAt: new Date(),
      position: insertError.position || null,
    };
    this.quranErrors.set(id, error);
    return error;
  }

  async deleteQuranError(id: string): Promise<boolean> {
    return this.quranErrors.delete(id);
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

// استخدام Supabase كقاعدة البيانات الأساسية مع MemStorage كنسخة احتياطية
let storage: IStorage;

try {
  // التحقق من وجود DATABASE_URL قبل محاولة الاتصال بـ Supabase
  if (process.env.DATABASE_URL) {
    storage = new SupabaseStorage();
    console.log("✅ تم الاتصال بـ Supabase بنجاح");
  } else {
    console.log("⚠️ DATABASE_URL غير موجود، استخدام التخزين المحلي");
    storage = new MemStorage();
  }
} catch (error) {
  console.warn("⚠️ فشل الاتصال بـ Supabase، استخدام التخزين المحلي:", error);
  storage = new MemStorage();
}

export { storage };