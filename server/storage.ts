import { type Teacher, type InsertTeacher, type Parent, type InsertParent, type Student, type InsertStudent, type DailyRecord, type InsertDailyRecord, type QuranError, type InsertQuranError } from "@shared/schema";
import { randomUUID } from "crypto";
import { DatabaseStorage } from "./db";
import { FirebaseStorage } from "./firebase-storage";

export interface IStorage {
  // Teachers
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherByUsername(username: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Parents
  getParent(id: string): Promise<Parent | undefined>;
  getParentByUsername(username: string): Promise<Parent | undefined>;
  createParent(parent: InsertParent): Promise<Parent>;
  
  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getStudentsByTeacher(teacherId: string): Promise<Student[]>;
  getStudentsByParent(parentId: string): Promise<Student[]>;
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
  validateParent(username: string, password: string): Promise<Parent | null>;
}

export class MemStorage implements IStorage {
  private teachers: Map<string, Teacher>;
  private parents: Map<string, Parent>;
  private students: Map<string, Student>;
  private dailyRecords: Map<string, DailyRecord>;
  private quranErrors: Map<string, QuranError>;

  constructor() {
    this.teachers = new Map();
    this.parents = new Map();
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
    });

    // Sample parents
    const sampleParents = [
      { username: "parent1", password: "123456", fatherName: "أحمد محمد الأحمد", motherName: "فاطمة علي", phone: "0505123456", email: "ahmed@example.com" },
      { username: "parent2", password: "123456", fatherName: "محمد عبدالله السعد", motherName: "عائشة يوسف", phone: "0505234567", email: "mohammed@example.com" },
      { username: "parent3", password: "123456", fatherName: "علي حسن الخالد", motherName: "خديجة أحمد", phone: "0505345678", email: "ali@example.com" },
      { username: "parent4", password: "123456", fatherName: "يوسف إبراهيم النور", motherName: "زينب محمد", phone: "0505456789", email: "youssef@example.com" },
      { username: "parent5", password: "123456", fatherName: "عبدالرحمن صالح الريس", motherName: "أم كلثوم", phone: "0505567890", email: "abdulrahman@example.com" },
    ];

    sampleParents.forEach(parentData => {
      const parent: Parent = {
        ...parentData,
        id: randomUUID(),
        createdAt: new Date(),
        email: parentData.email || null,
        motherName: parentData.motherName || null,
      };
      this.parents.set(parent.id, parent);
    });

    // Sample students with parent connections
    const teachersArray = Array.from(this.teachers.values());
    const parentsArray = Array.from(this.parents.values());
    
    if (teachersArray.length > 0 && parentsArray.length > 0) {
      const sampleStudents = [
        { name: "عبدالله أحمد", age: 8, level: "beginner", parentIndex: 0, teacherGender: "male" },
        { name: "فاطمة أحمد", age: 10, level: "intermediate", parentIndex: 0, teacherGender: "female" },
        { name: "محمد عبدالله", age: 12, level: "advanced", parentIndex: 1, teacherGender: "male" },
        { name: "عائشة محمد", age: 9, level: "beginner", parentIndex: 1, teacherGender: "female" },
        { name: "علي حسن", age: 11, level: "intermediate", parentIndex: 2, teacherGender: "male" },
        { name: "خديجة علي", age: 7, level: "beginner", parentIndex: 2, teacherGender: "female" },
        { name: "يوسف إبراهيم", age: 13, level: "advanced", parentIndex: 3, teacherGender: "male" },
        { name: "زينب يوسف", age: 8, level: "beginner", parentIndex: 3, teacherGender: "female" },
        { name: "عبدالرحمن صالح", age: 10, level: "intermediate", parentIndex: 4, teacherGender: "male" },
      ];

      sampleStudents.forEach(studentData => {
        const availableTeachers = teachersArray.filter(t => t.gender === studentData.teacherGender);
        const randomTeacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
        const parent = parentsArray[studentData.parentIndex];

        if (randomTeacher && parent) {
          const student: Student = {
            id: randomUUID(),
            name: studentData.name,
            age: studentData.age,
            level: studentData.level,
            teacherId: randomTeacher.id,
            parentId: parent.id,
            phone: null,
            createdAt: new Date(),
          };
          this.students.set(student.id, student);
        }
      });
    }
  }

  // Teachers
  async getTeacher(id: string): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeacherByUsername(username: string): Promise<Teacher | undefined> {
    return Array.from(this.teachers.values()).find(teacher => teacher.username === username);
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

  // Parents
  async getParent(id: string): Promise<Parent | undefined> {
    return this.parents.get(id);
  }

  async getParentByUsername(username: string): Promise<Parent | undefined> {
    return Array.from(this.parents.values()).find(parent => parent.username === username);
  }

  async createParent(insertParent: InsertParent): Promise<Parent> {
    const id = randomUUID();
    const parent: Parent = { 
      ...insertParent, 
      id,
      createdAt: new Date(),
      email: insertParent.email || null,
      motherName: insertParent.motherName || null,
    };
    this.parents.set(id, parent);
    return parent;
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(student => student.teacherId === teacherId);
  }

  async getStudentsByParent(parentId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(student => student.parentId === parentId);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = { 
      ...insertStudent, 
      id,
      createdAt: new Date(),
      phone: insertStudent.phone || null,
      parentId: insertStudent.parentId || null,
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

  async validateParent(username: string, password: string): Promise<Parent | null> {
    const parent = await this.getParentByUsername(username);
    if (parent && parent.password === password) {
      return parent;
    }
    return null;
  }
}

// استخدام MemStorage مؤقتاً حتى يتم تفعيل Firebase Firestore
export const storage = new MemStorage();

// لاستخدام Firebase، قم بتفعيل Firestore API أولاً ثم استخدم:
// export const storage = new FirebaseStorage();
