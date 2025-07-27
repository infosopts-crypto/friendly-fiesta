import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  gender: text("gender").notNull(), // 'male' or 'female'
  circleName: text("circle_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parents = pgTable("parents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name"),
  phone: text("phone").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  phone: text("phone"),
  level: text("level").notNull(), // 'beginner', 'intermediate', 'advanced'
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  parentId: varchar("parent_id").references(() => parents.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyRecords = pgTable("daily_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  
  // Date and basic info
  hijriDate: text("hijri_date").notNull(),
  day: text("day").notNull(),
  
  // Section 1: Memorization and Review
  dailyLesson: text("daily_lesson"), // Surah name
  lessonFromVerse: integer("lesson_from_verse"),
  lessonToVerse: integer("lesson_to_verse"),
  lastFivePages: text("last_five_pages"),
  dailyReview: text("daily_review"),
  reviewFrom: text("review_from"),
  reviewTo: text("review_to"),
  pageCount: integer("page_count"),
  errors: text("errors"),
  reminders: text("reminders"),
  listenerName: text("listener_name"),
  
  // Section 2: Evaluation and Behavior
  behavior: text("behavior"), // 'good' or 'bad'
  other: text("other"), // 'good' or 'bad'
  totalScore: integer("total_score"), // Manual entry only
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const quranErrors = pgTable("quran_errors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  surah: text("surah").notNull(),
  verse: integer("verse").notNull(),
  pageNumber: integer("page_number").notNull(),
  errorType: text("error_type").notNull(), // 'repeated' or 'previous'
  position: jsonb("position"), // For highlighting specific words/phrases
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export const insertParentSchema = createInsertSchema(parents).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertDailyRecordSchema = createInsertSchema(dailyRecords).omit({
  id: true,
  createdAt: true,
});

export const insertQuranErrorSchema = createInsertSchema(quranErrors).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

// Types
export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Parent = typeof parents.$inferSelect;
export type InsertParent = z.infer<typeof insertParentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type DailyRecord = typeof dailyRecords.$inferSelect;
export type InsertDailyRecord = z.infer<typeof insertDailyRecordSchema>;
export type QuranError = typeof quranErrors.$inferSelect;
export type InsertQuranError = z.infer<typeof insertQuranErrorSchema>;
export type LoginData = z.infer<typeof loginSchema>;
