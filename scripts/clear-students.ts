import { storage } from "../server/storage";

async function clearAllStudents() {
  try {
    console.log("🧹 بدء حذف جميع الطلاب...");
    
    // الحصول على جميع الطلاب
    const allStudents = await storage.getAllStudents();
    console.log(`📊 عدد الطلاب الحاليين: ${allStudents.length}`);
    
    let deletedCount = 0;
    
    // حذف كل طالب
    for (const student of allStudents) {
      try {
        const deleted = await storage.deleteStudent(student.id);
        if (deleted) {
          console.log(`✅ تم حذف الطالب/ة: ${student.name}`);
          deletedCount++;
        }
      } catch (error) {
        console.error(`❌ خطأ في حذف ${student.name}:`, error);
      }
    }
    
    console.log(`🎉 تم حذف ${deletedCount} طالب/ة بنجاح!`);
    
    // التحقق من النتيجة
    const remainingStudents = await storage.getAllStudents();
    console.log(`📊 عدد الطلاب المتبقين: ${remainingStudents.length}`);
    
    if (remainingStudents.length === 0) {
      console.log("✨ تم تنظيف قاعدة البيانات بنجاح - جاهزة لإضافة الطلاب يدوياً");
    }
    
  } catch (error) {
    console.error("❌ خطأ عام في حذف الطلاب:", error);
  }
}

clearAllStudents();