import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase-config";
import type { Teacher, InsertTeacher, Student, InsertStudent, DailyRecord, InsertDailyRecord, QuranError, InsertQuranError } from "../shared/schema";
import type { IStorage } from "./storage";
import { randomUUID } from "crypto";

export class FirebaseStorage implements IStorage {
  
  constructor() {
    // تهيئة البيانات الأساسية عند إنشاء الكائن
    this.initializeBasicData();
  }

  private async initializeBasicData() {
    try {
      // التحقق من وجود المعلمين، وإضافتهم إذا لم يكونوا موجودين
      const teachersCollection = collection(db, "teachers");
      const teachersSnapshot = await getDocs(teachersCollection);
      
      if (teachersSnapshot.empty) {
        console.log("🕌 جاري إضافة المعلمين الأساسيين إلى Firebase...");
        await this.addDefaultTeachers();
        console.log("✅ تم إضافة جميع المعلمين بنجاح");
      } else {
        console.log("🟢 المعلمون موجودون بالفعل في Firebase");
      }
    } catch (error) {
      console.error("❌ خطأ في تهيئة البيانات الأساسية:", error);
      console.log("⚠️ سيتم استخدام البيانات المحلية كبديل");
    }
  }

  private async addDefaultTeachers() {
    // المعلمين للحلقات الرجالية
    const menTeachers = [
      { username: "abdalrazaq", password: "123456", name: "أ. عبدالرزاق", gender: "male", circleName: "حلقة عبدالرزاق" },
      { username: "ibrahim", password: "123456", name: "أ. إبراهيم كدوائي", gender: "male", circleName: "حلقة إبراهيم كدوائي" },
      { username: "hassan", password: "123456", name: "أ. حسن", gender: "male", circleName: "حلقة حسن" },
      { username: "saud", password: "123456", name: "أ. سعود", gender: "male", circleName: "حلقة سعود" },
      { username: "saleh", password: "123456", name: "أ. صالح", gender: "male", circleName: "حلقة صالح" },
      { username: "abdullah", password: "123456", name: "أ. عبدالله", gender: "male", circleName: "حلقة عبدالله" },
      { username: "nabil", password: "123456", name: "أ. نبيل", gender: "male", circleName: "حلقة نبيل" },
    ];

    // المعلمات للحلقات النسائية
    const womenTeachers = [
      { username: "asma", password: "123456", name: "أ. أسماء", gender: "female", circleName: "حلقة أسماء" },
      { username: "raghad", password: "123456", name: "أ. رغد", gender: "female", circleName: "حلقة رغد" },
      { username: "madina", password: "123456", name: "أ. مدينة", gender: "female", circleName: "حلقة مدينة" },
      { username: "nashwa", password: "123456", name: "أ. نشوة", gender: "female", circleName: "حلقة نشوة" },
      { username: "nour", password: "123456", name: "أ. نور", gender: "female", circleName: "حلقة نور" },
      { username: "hind", password: "123456", name: "أ. هند", gender: "female", circleName: "حلقة هند" },
    ];

    const allTeachers = [...menTeachers, ...womenTeachers];
    
    for (const teacherData of allTeachers) {
      await addDoc(collection(db, "teachers"), {
        ...teacherData,
        createdAt: serverTimestamp()
      });
    }
  }
  
  // Teachers
  async getTeacher(id: string): Promise<Teacher | undefined> {
    try {
      const docRef = doc(db, "teachers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Teacher;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting teacher:", error);
      return undefined;
    }
  }

  async getTeacherByUsername(username: string): Promise<Teacher | undefined> {
    try {
      const q = query(collection(db, "teachers"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Teacher;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting teacher by username:", error);
      return undefined;
    }
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    try {
      const docRef = await addDoc(collection(db, "teachers"), {
        ...teacher,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...teacher } as Teacher;
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  }

  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "teachers"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
    } catch (error) {
      console.error("Error getting all teachers:", error);
      return [];
    }
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    try {
      const docRef = doc(db, "students", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Student;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting student:", error);
      return undefined;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
      console.error("Error getting all students:", error);
      return [];
    }
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    try {
      const q = query(collection(db, "students"), where("teacherId", "==", teacherId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
      console.error("Error getting students by teacher:", error);
      return [];
    }
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    try {
      const docRef = await addDoc(collection(db, "students"), {
        ...student,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...student } as Student;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    try {
      const docRef = doc(db, "students", id);
      await updateDoc(docRef, {
        ...student,
        updatedAt: serverTimestamp()
      });
      return await this.getStudent(id);
    } catch (error) {
      console.error("Error updating student:", error);
      return undefined;
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, "students", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      return false;
    }
  }

  // Daily Records
  async getDailyRecord(id: string): Promise<DailyRecord | undefined> {
    try {
      const docRef = doc(db, "dailyRecords", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DailyRecord;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting daily record:", error);
      return undefined;
    }
  }

  async getDailyRecordsByStudent(studentId: string): Promise<DailyRecord[]> {
    try {
      const q = query(collection(db, "dailyRecords"), where("studentId", "==", studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyRecord));
    } catch (error) {
      console.error("Error getting daily records by student:", error);
      return [];
    }
  }

  async getDailyRecordsByTeacher(teacherId: string): Promise<DailyRecord[]> {
    try {
      const q = query(collection(db, "dailyRecords"), where("teacherId", "==", teacherId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyRecord));
    } catch (error) {
      console.error("Error getting daily records by teacher:", error);
      return [];
    }
  }

  async createDailyRecord(record: InsertDailyRecord): Promise<DailyRecord> {
    try {
      const docRef = await addDoc(collection(db, "dailyRecords"), {
        ...record,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...record } as DailyRecord;
    } catch (error) {
      console.error("Error creating daily record:", error);
      throw error;
    }
  }

  async updateDailyRecord(id: string, record: Partial<InsertDailyRecord>): Promise<DailyRecord | undefined> {
    try {
      const docRef = doc(db, "dailyRecords", id);
      await updateDoc(docRef, {
        ...record,
        updatedAt: serverTimestamp()
      });
      return await this.getDailyRecord(id);
    } catch (error) {
      console.error("Error updating daily record:", error);
      return undefined;
    }
  }

  async deleteDailyRecord(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, "dailyRecords", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting daily record:", error);
      return false;
    }
  }

  // Quran Errors
  async getQuranErrorsByStudent(studentId: string): Promise<QuranError[]> {
    try {
      const q = query(collection(db, "quranErrors"), where("studentId", "==", studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuranError));
    } catch (error) {
      console.error("Error getting quran errors by student:", error);
      return [];
    }
  }

  async createQuranError(quranError: InsertQuranError): Promise<QuranError> {
    try {
      const docRef = await addDoc(collection(db, "quranErrors"), {
        ...quranError,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...quranError } as QuranError;
    } catch (error) {
      console.error("Error creating quran error:", error);
      throw error;
    }
  }

  async deleteQuranError(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, "quranErrors", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting quran error:", error);
      return false;
    }
  }

  // Authentication
  async validateTeacher(username: string, password: string): Promise<Teacher | null> {
    try {
      const teacher = await this.getTeacherByUsername(username);
      if (teacher && teacher.password === password) {
        return teacher;
      }
      return null;
    } catch (error) {
      console.error("Error validating teacher:", error);
      return null;
    }
  }
}