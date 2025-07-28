import { createClient } from '@supabase/supabase-js';
import type { 
  Teacher, 
  InsertTeacher, 
  Student, 
  InsertStudent, 
  DailyRecord, 
  InsertDailyRecord, 
  QuranError, 
  InsertQuranError 
} from "@shared/schema";
import type { IStorage } from "./storage";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xwbapwyslonhxxwynean.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YmFwd3lzbG9uaHh4d3luZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzk0NDEsImV4cCI6MjA2OTAxNTQ0MX0.rupOaPIk9LSSzCgnBfz7l9ZfsQCIbZ8CxoCSVk-Enus';

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  
  // Teachers
  async getTeacher(id: string): Promise<Teacher | undefined> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error getting teacher:', error);
        return undefined;
      }
      
      return this.mapTeacherFromDb(data);
    } catch (error) {
      console.error('Error getting teacher:', error);
      return undefined;
    }
  }

  async getTeacherByUsername(username: string): Promise<Teacher | undefined> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error('Error getting teacher by username:', error);
        }
        return undefined;
      }
      
      return this.mapTeacherFromDb(data);
    } catch (error) {
      console.error('Error getting teacher by username:', error);
      return undefined;
    }
  }

  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error getting all teachers:', error);
        return [];
      }
      
      return data.map(this.mapTeacherFromDb);
    } catch (error) {
      console.error('Error getting all teachers:', error);
      return [];
    }
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          username: teacher.username,
          password: teacher.password,
          name: teacher.name,
          gender: teacher.gender,
          circle_name: teacher.circleName,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating teacher:', error);
        throw error;
      }
      
      return this.mapTeacherFromDb(data);
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error getting student:', error);
        return undefined;
      }
      
      return this.mapStudentFromDb(data);
    } catch (error) {
      console.error('Error getting student:', error);
      return undefined;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error getting all students:', error);
        return [];
      }
      
      return data.map(this.mapStudentFromDb);
    } catch (error) {
      console.error('Error getting all students:', error);
      return [];
    }
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('name');
      
      if (error) {
        console.error('Error getting students by teacher:', error);
        return [];
      }
      
      return data.map(this.mapStudentFromDb);
    } catch (error) {
      console.error('Error getting students by teacher:', error);
      return [];
    }
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: student.name,
          age: student.age,
          phone: student.phone,
          level: student.level,
          teacher_id: student.teacherId,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating student:', error);
        throw error;
      }
      
      return this.mapStudentFromDb(data);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    try {
      const updateData: any = {};
      if (student.name) updateData.name = student.name;
      if (student.age) updateData.age = student.age;
      if (student.phone !== undefined) updateData.phone = student.phone;
      if (student.level) updateData.level = student.level;
      if (student.teacherId) updateData.teacher_id = student.teacherId;
      
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating student:', error);
        return undefined;
      }
      
      return this.mapStudentFromDb(data);
    } catch (error) {
      console.error('Error updating student:', error);
      return undefined;
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting student:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  }

  // Daily Records
  async getDailyRecord(id: string): Promise<DailyRecord | undefined> {
    try {
      const { data, error } = await supabase
        .from('daily_records')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error getting daily record:', error);
        return undefined;
      }
      
      return this.mapDailyRecordFromDb(data);
    } catch (error) {
      console.error('Error getting daily record:', error);
      return undefined;
    }
  }

  async getDailyRecordsByStudent(studentId: string): Promise<DailyRecord[]> {
    try {
      const { data, error } = await supabase
        .from('daily_records')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting daily records by student:', error);
        return [];
      }
      
      return data.map(this.mapDailyRecordFromDb);
    } catch (error) {
      console.error('Error getting daily records by student:', error);
      return [];
    }
  }

  async getDailyRecordsByTeacher(teacherId: string): Promise<DailyRecord[]> {
    try {
      const { data, error } = await supabase
        .from('daily_records')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting daily records by teacher:', error);
        return [];
      }
      
      return data.map(this.mapDailyRecordFromDb);
    } catch (error) {
      console.error('Error getting daily records by teacher:', error);
      return [];
    }
  }

  async createDailyRecord(record: InsertDailyRecord): Promise<DailyRecord> {
    try {
      const { data, error } = await supabase
        .from('daily_records')
        .insert({
          student_id: record.studentId,
          teacher_id: record.teacherId,
          hijri_date: record.hijriDate,
          day: record.day,
          daily_lesson: record.dailyLesson,
          lesson_from_verse: record.lessonFromVerse,
          lesson_to_verse: record.lessonToVerse,
          last_five_pages: record.lastFivePages,
          daily_review: record.dailyReview,
          review_from: record.reviewFrom,
          review_to: record.reviewTo,
          page_count: record.pageCount,
          errors: record.errors,
          reminders: record.reminders,
          listener_name: record.listenerName,
          behavior: record.behavior,
          other: record.other,
          total_score: record.totalScore,
          notes: record.notes,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating daily record:', error);
        throw error;
      }
      
      return this.mapDailyRecordFromDb(data);
    } catch (error) {
      console.error('Error creating daily record:', error);
      throw error;
    }
  }

  async updateDailyRecord(id: string, record: Partial<InsertDailyRecord>): Promise<DailyRecord | undefined> {
    try {
      const updateData: any = {};
      if (record.hijriDate) updateData.hijri_date = record.hijriDate;
      if (record.day) updateData.day = record.day;
      if (record.dailyLesson !== undefined) updateData.daily_lesson = record.dailyLesson;
      if (record.lessonFromVerse !== undefined) updateData.lesson_from_verse = record.lessonFromVerse;
      if (record.lessonToVerse !== undefined) updateData.lesson_to_verse = record.lessonToVerse;
      if (record.lastFivePages !== undefined) updateData.last_five_pages = record.lastFivePages;
      if (record.dailyReview !== undefined) updateData.daily_review = record.dailyReview;
      if (record.reviewFrom !== undefined) updateData.review_from = record.reviewFrom;
      if (record.reviewTo !== undefined) updateData.review_to = record.reviewTo;
      if (record.pageCount !== undefined) updateData.page_count = record.pageCount;
      if (record.errors !== undefined) updateData.errors = record.errors;
      if (record.reminders !== undefined) updateData.reminders = record.reminders;
      if (record.listenerName !== undefined) updateData.listener_name = record.listenerName;
      if (record.behavior !== undefined) updateData.behavior = record.behavior;
      if (record.other !== undefined) updateData.other = record.other;
      if (record.totalScore !== undefined) updateData.total_score = record.totalScore;
      if (record.notes !== undefined) updateData.notes = record.notes;
      
      const { data, error } = await supabase
        .from('daily_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating daily record:', error);
        return undefined;
      }
      
      return this.mapDailyRecordFromDb(data);
    } catch (error) {
      console.error('Error updating daily record:', error);
      return undefined;
    }
  }

  async deleteDailyRecord(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('daily_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting daily record:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting daily record:', error);
      return false;
    }
  }

  // Quran Errors
  async getQuranErrorsByStudent(studentId: string): Promise<QuranError[]> {
    try {
      const { data, error } = await supabase
        .from('quran_errors')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting quran errors by student:', error);
        return [];
      }
      
      return data.map(this.mapQuranErrorFromDb);
    } catch (error) {
      console.error('Error getting quran errors by student:', error);
      return [];
    }
  }

  async createQuranError(quranError: InsertQuranError): Promise<QuranError> {
    try {
      const { data, error } = await supabase
        .from('quran_errors')
        .insert({
          student_id: quranError.studentId,
          surah: quranError.surah,
          verse: quranError.verse,
          page_number: quranError.pageNumber,
          error_type: quranError.errorType,
          position: quranError.position,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating quran error:', error);
        throw error;
      }
      
      return this.mapQuranErrorFromDb(data);
    } catch (error) {
      console.error('Error creating quran error:', error);
      throw error;
    }
  }

  async deleteQuranError(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quran_errors')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting quran error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting quran error:', error);
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
      console.error('Error validating teacher:', error);
      return null;
    }
  }

  // Helper methods to map database fields to schema fields
  private mapTeacherFromDb(data: any): Teacher {
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      name: data.name,
      gender: data.gender,
      circleName: data.circle_name,
      createdAt: new Date(data.created_at),
    };
  }

  private mapStudentFromDb(data: any): Student {
    return {
      id: data.id,
      name: data.name,
      age: data.age,
      phone: data.phone,
      level: data.level,
      teacherId: data.teacher_id,
      currentSurah: data.current_surah || '',
      totalPages: data.total_pages || 0,
      createdAt: new Date(data.created_at),
    };
  }

  private mapDailyRecordFromDb(data: any): DailyRecord {
    return {
      id: data.id,
      studentId: data.student_id,
      teacherId: data.teacher_id,
      hijriDate: data.hijri_date,
      day: data.day,
      dailyLesson: data.daily_lesson,
      lessonFromVerse: data.lesson_from_verse,
      lessonToVerse: data.lesson_to_verse,
      lastFivePages: data.last_five_pages,
      dailyReview: data.daily_review,
      reviewFrom: data.review_from,
      reviewTo: data.review_to,
      pageCount: data.page_count,
      errors: data.errors,
      reminders: data.reminders,
      listenerName: data.listener_name,
      behavior: data.behavior,
      other: data.other,
      totalScore: data.total_score,
      notes: data.notes,
      createdAt: new Date(data.created_at),
    };
  }

  private mapQuranErrorFromDb(data: any): QuranError {
    return {
      id: data.id,
      studentId: data.student_id,
      surah: data.surah,
      verse: data.verse,
      pageNumber: data.page_number,
      errorType: data.error_type,
      position: data.position,
      createdAt: new Date(data.created_at),
    };
  }
}