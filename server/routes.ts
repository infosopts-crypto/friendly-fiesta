import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertStudentSchema, insertDailyRecordSchema, insertQuranErrorSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const teacher = await storage.validateTeacher(username, password);
      
      if (!teacher) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      // Return teacher data without password
      const { password: _, ...teacherData } = teacher;
      res.json(teacherData);
    } catch (error) {
      res.status(400).json({ message: "بيانات غير صالحة" });
    }
  });

  // Students
  app.get("/api/teachers/:teacherId/students", async (req, res) => {
    try {
      const { teacherId } = req.params;
      const students = await storage.getStudentsByTeacher(teacherId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب بيانات الطلاب" });
    }
  });

  app.post("/api/teachers/:teacherId/students", async (req, res) => {
    try {
      const { teacherId } = req.params;
      const studentData = insertStudentSchema.parse({ ...req.body, teacherId });
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: "خطأ في إضافة الطالب" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const student = await storage.updateStudent(id, updateData);
      
      if (!student) {
        return res.status(404).json({ message: "الطالب غير موجود" });
      }
      
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث بيانات الطالب" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStudent(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "الطالب غير موجود" });
      }
      
      res.json({ message: "تم حذف الطالب بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف الطالب" });
    }
  });

  // Public route to get all students (for parents portal)
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب بيانات الطلاب" });
    }
  });

  // Daily Records
  app.get("/api/teachers/:teacherId/records", async (req, res) => {
    try {
      const { teacherId } = req.params;
      const records = await storage.getDailyRecordsByTeacher(teacherId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب السجلات" });
    }
  });

  app.get("/api/students/:studentId/records", async (req, res) => {
    try {
      const { studentId } = req.params;
      const records = await storage.getDailyRecordsByStudent(studentId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب سجلات الطالب" });
    }
  });

  app.post("/api/records", async (req, res) => {
    try {
      const recordData = insertDailyRecordSchema.parse(req.body);
      const record = await storage.createDailyRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "خطأ في إضافة السجل" });
    }
  });

  app.put("/api/records/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const record = await storage.updateDailyRecord(id, updateData);
      
      if (!record) {
        return res.status(404).json({ message: "السجل غير موجود" });
      }
      
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث السجل" });
    }
  });

  app.delete("/api/records/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDailyRecord(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "السجل غير موجود" });
      }
      
      res.json({ message: "تم حذف السجل بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف السجل" });
    }
  });

  // Quran Errors
  app.get("/api/students/:studentId/quran-errors", async (req, res) => {
    try {
      const { studentId } = req.params;
      const errors = await storage.getQuranErrorsByStudent(studentId);
      res.json(errors);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب أخطاء القرآن" });
    }
  });

  app.post("/api/quran-errors", async (req, res) => {
    try {
      const errorData = insertQuranErrorSchema.parse(req.body);
      const error = await storage.createQuranError(errorData);
      res.status(201).json(error);
    } catch (error) {
      res.status(400).json({ message: "خطأ في إضافة خطأ القرآن" });
    }
  });

  app.delete("/api/quran-errors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteQuranError(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "الخطأ غير موجود" });
      }
      
      res.json({ message: "تم حذف الخطأ بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف الخطأ" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
