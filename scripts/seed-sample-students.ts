import { storage } from "../server/storage";
import type { InsertStudent } from "../shared/schema";

async function seedSampleStudents() {
  try {
    console.log("🌱 بدء إضافة طلاب تجريبيين...");
    
    // الحصول على جميع المعلمين
    const teachers = await Promise.all([
      storage.getTeacherByUsername("abdalrazaq"),
      storage.getTeacherByUsername("ibrahim"),
      storage.getTeacherByUsername("hassan"),
      storage.getTeacherByUsername("asma"),
      storage.getTeacherByUsername("raghad"),
      storage.getTeacherByUsername("madina")
    ]);
    
    const maleTeachers = teachers.filter(t => t && t.gender === 'male').map(t => t!);
    const femaleTeachers = teachers.filter(t => t && t.gender === 'female').map(t => t!);
    
    // طلاب الحلقات الرجالية
    const maleStudents: Omit<InsertStudent, 'teacherId'>[] = [
      { name: "أحمد محمد العلي", age: 12, level: "beginner", phone: "0501234567" },
      { name: "عبدالله سعد الأحمد", age: 14, level: "intermediate", phone: "0507654321" },
      { name: "محمد عبدالرحمن", age: 16, level: "advanced", phone: "0509876543" },
      { name: "عمر خالد السالم", age: 10, level: "beginner", phone: "0502468135" },
      { name: "سعد فهد المطيري", age: 15, level: "intermediate", phone: "0508642097" },
      { name: "يوسف أحمد الزهراني", age: 13, level: "beginner", phone: "0503691472" },
      { name: "فيصل عبدالعزيز", age: 17, level: "advanced", phone: "0505827394" },
      { name: "نايف محمد القحطاني", age: 11, level: "beginner", phone: "0504173658" },
      { name: "خالد عبدالله الدوسري", age: 14, level: "intermediate", phone: "0506295817" },
      { name: "بندر سلطان العتيبي", age: 16, level: "advanced", phone: "0507418269" }
    ];
    
    // طالبات الحلقات النسائية
    const femaleStudents: Omit<InsertStudent, 'teacherId'>[] = [
      { name: "فاطمة أحمد الشمري", age: 11, level: "beginner", phone: "0501122334" },
      { name: "عائشة محمد الغامدي", age: 13, level: "intermediate", phone: "0502233445" },
      { name: "خديجة عبدالله", age: 15, level: "advanced", phone: "0503344556" },
      { name: "مريم سعد الحربي", age: 10, level: "beginner", phone: "0504455667" },
      { name: "زينب خالد العنزي", age: 14, level: "intermediate", phone: "0505566778" },
      { name: "حفصة عبدالرحمن", age: 12, level: "beginner", phone: "0506677889" },
      { name: "أم كلثوم فهد", age: 16, level: "advanced", phone: "0507788990" },
      { name: "صفية محمد الرشيد", age: 13, level: "intermediate", phone: "0508899001" },
      { name: "جويرية عبدالعزيز", age: 11, level: "beginner", phone: "0509900112" },
      { name: "أسماء سلطان القرني", age: 15, level: "advanced", phone: "0500011223" }
    ];
    
    let addedCount = 0;
    
    // إضافة الطلاب الذكور
    for (let i = 0; i < maleStudents.length; i++) {
      const student = maleStudents[i];
      const teacher = maleTeachers[i % maleTeachers.length];
      
      try {
        await storage.createStudent({
          ...student,
          teacherId: teacher.id
        });
        console.log(`✅ تم إضافة الطالب: ${student.name} - حلقة ${teacher.name}`);
        addedCount++;
      } catch (error) {
        console.error(`❌ خطأ في إضافة ${student.name}:`, error);
      }
    }
    
    // إضافة الطالبات
    for (let i = 0; i < femaleStudents.length; i++) {
      const student = femaleStudents[i];
      const teacher = femaleTeachers[i % femaleTeachers.length];
      
      try {
        await storage.createStudent({
          ...student,
          teacherId: teacher.id
        });
        console.log(`✅ تم إضافة الطالبة: ${student.name} - حلقة ${teacher.name}`);
        addedCount++;
      } catch (error) {
        console.error(`❌ خطأ في إضافة ${student.name}:`, error);
      }
    }
    
    console.log(`🎉 تم إضافة ${addedCount} طالب/ة بنجاح!`);
    console.log(`👦 طلاب الحلقات الرجالية: ${maleStudents.length}`);
    console.log(`👧 طالبات الحلقات النسائية: ${femaleStudents.length}`);
    
  } catch (error) {
    console.error("❌ خطأ عام في إضافة الطلاب:", error);
  }
}

seedSampleStudents();