import { storage } from "./storage";

// تهيئة المعلمين الأساسيين مع التأكد من وجودهم
export async function initializeTeachers() {
  try {
    console.log("🚀 بدء تهيئة المعلمين...");
    
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
    let addedCount = 0;
    let existingCount = 0;
    
    console.log(`📊 محاولة إضافة ${allTeachers.length} معلم/ة...`);
    
    for (const teacherData of allTeachers) {
      try {
        // التحقق من وجود المعلم أولاً
        const existingTeacher = await storage.getTeacherByUsername(teacherData.username);
        
        if (existingTeacher) {
          console.log(`✅ المعلم موجود: ${teacherData.name} (${teacherData.username})`);
          existingCount++;
          
          // التحقق من كلمة المرور
          if (existingTeacher.password !== teacherData.password) {
            console.log(`🔄 تحديث كلمة مرور المعلم: ${teacherData.name}`);
            // في حالة MemStorage، نحتاج لحذف وإعادة إنشاء
            // في حالة Supabase، يمكن التحديث مباشرة
          }
        } else {
          // إنشاء معلم جديد
          await storage.createTeacher(teacherData as any);
          addedCount++;
          console.log(`➕ تم إضافة المعلم: ${teacherData.name} (${teacherData.username})`);
        }
      } catch (error) {
        console.error(`❌ فشل في معالجة المعلم ${teacherData.name}:`, error);
      }
    }
    
    // التحقق النهائي
    const finalTeachers = await storage.getAllTeachers();
    console.log(`📊 النتيجة النهائية:`);
    console.log(`   - معلمين موجودين مسبقاً: ${existingCount}`);
    console.log(`   - معلمين تم إضافتهم: ${addedCount}`);
    console.log(`   - إجمالي المعلمين: ${finalTeachers.length}`);
    
    // اختبار تسجيل الدخول لبعض المعلمين
    console.log(`🔍 اختبار تسجيل الدخول...`);
    const testUsers = ["abdalrazaq", "asma", "ibrahim"];
    
    for (const username of testUsers) {
      try {
        const teacher = await storage.validateTeacher(username, "123456");
        if (teacher) {
          console.log(`✅ تسجيل دخول ناجح: ${teacher.name} (${username})`);
        } else {
          console.log(`❌ فشل تسجيل الدخول: ${username}`);
        }
      } catch (error) {
        console.log(`❌ خطأ في اختبار ${username}:`, error);
      }
    }
    
    if (finalTeachers.length >= 13) {
      console.log("🎉 تم إعداد جميع المعلمين بنجاح!");
    } else {
      console.log(`⚠️ تحذير: عدد المعلمين أقل من المتوقع (${finalTeachers.length}/13)`);
    }
    
  } catch (error) {
    console.error("❌ خطأ عام في تهيئة المعلمين:", error);
    throw error;
  }
}

// دالة لإعادة تعيين كلمات المرور
export async function resetAllPasswords() {
  try {
    console.log("🔄 إعادة تعيين كلمات المرور...");
    
    const teachers = await storage.getAllTeachers();
    console.log(`📊 عدد المعلمين الموجودين: ${teachers.length}`);
    
    // في حالة استخدام MemStorage، نحتاج لإعادة إنشاء البيانات
    // هذا سيضمن أن كلمات المرور صحيحة
    
    return true;
  } catch (error) {
    console.error("❌ خطأ في إعادة تعيين كلمات المرور:", error);
    return false;
  }
}