import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { teachers, students, dailyRecords, quranErrors } from "../shared/schema";
import { randomUUID } from "crypto";

// التحقق من وجود رابط قاعدة البيانات
if (!process.env.DATABASE_URL) {
  console.error("❌ خطأ: لم يتم العثور على DATABASE_URL");
  console.log("📋 يرجى إضافة رابط قاعدة البيانات من Supabase في Secrets");
  console.log("🔗 اتبع التعليمات في ملف SUPABASE_SETUP.md");
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

const teachersData = [
  // حلقات الرجال
  { name: "أ. عبدالرزاق", username: "abdalrazaq", password: "Quran2024@", gender: "male" as const, circleName: "حلقة عبدالرزاق" },
  { name: "أ. إبراهيم كدوائي", username: "ibrahim", password: "Ibrahim123#", gender: "male" as const, circleName: "حلقة إبراهيم كدوائي" },
  { name: "أ. حسن", username: "hassan", password: "Hassan456$", gender: "male" as const, circleName: "حلقة حسن" },
  { name: "أ. سعود", username: "saud", password: "Saud789%", gender: "male" as const, circleName: "حلقة سعود" },
  { name: "أ. صالح", username: "saleh", password: "Saleh012^", gender: "male" as const, circleName: "حلقة صالح" },
  { name: "أ. عبدالله", username: "abdullah", password: "Abdullah345&", gender: "male" as const, circleName: "حلقة عبدالله" },
  { name: "أ. نبيل", username: "nabil", password: "Nabil678*", gender: "male" as const, circleName: "حلقة نبيل" },
  
  // حلقات النساء
  { name: "أ. أسماء", username: "asma", password: "Asma2024@", gender: "female" as const, circleName: "حلقة أسماء" },
  { name: "أ. رغد", username: "raghad", password: "Raghad123#", gender: "female" as const, circleName: "حلقة رغد" },
  { name: "أ. مدينة", username: "madina", password: "Madina456$", gender: "female" as const, circleName: "حلقة مدينة" },
  { name: "أ. نشوة", username: "nashwa", password: "Nashwa789%", gender: "female" as const, circleName: "حلقة نشوة" },
  { name: "أ. نور", username: "nour", password: "Nour012^", gender: "female" as const, circleName: "حلقة نور" },
  { name: "أ. هند", username: "hind", password: "Hind345&", gender: "female" as const, circleName: "حلقة هند" },
];

async function setupSupabase() {
  try {
    console.log("🚀 بدء إعداد قاعدة بيانات Supabase...");
    console.log("🔗 الاتصال بـ:", connectionString.replace(/:[^:@]*@/, ":****@"));
    
    // التحقق من الاتصال
    console.log("🔍 اختبار الاتصال...");
    await client`SELECT 1`;
    console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!");
    
    // التحقق من وجود البيانات مسبقاً
    console.log("📊 فحص البيانات الموجودة...");
    const existingTeachers = await db.select().from(teachers);
    
    if (existingTeachers.length > 0) {
      console.log(`📚 تم العثور على ${existingTeachers.length} معلم موجود مسبقاً`);
      console.log("✨ قاعدة البيانات جاهزة للاستخدام!");
      return;
    }
    
    // إدخال بيانات المعلمين
    console.log("👥 إدخال بيانات المعلمين...");
    
    for (const teacher of teachersData) {
      await db.insert(teachers).values({
        id: randomUUID(),
        ...teacher
      });
      console.log(`✅ تم إضافة: ${teacher.name}`);
    }
    
    // عرض النتائج النهائية
    const finalResult = await db.select().from(teachers);
    const maleTeachers = finalResult.filter(t => t.gender === 'male').length;
    const femaleTeachers = finalResult.filter(t => t.gender === 'female').length;
    
    console.log("\n🎉 تم إعداد قاعدة البيانات بنجاح!");
    console.log(`📊 إجمالي المعلمين: ${finalResult.length}`);
    console.log(`👨‍🏫 معلمين الرجال: ${maleTeachers}`);
    console.log(`👩‍🏫 معلمات النساء: ${femaleTeachers}`);
    console.log("\n🚀 النظام جاهز للاستخدام مع Supabase!");
    
  } catch (error) {
    console.error("❌ خطأ في إعداد قاعدة البيانات:");
    console.error(error);
    console.log("\n📋 تأكد من:");
    console.log("1. صحة رابط DATABASE_URL");
    console.log("2. أن قاعدة البيانات Supabase متاحة");
    console.log("3. أن كلمة المرور صحيحة في الرابط");
  } finally {
    await client.end();
  }
}

// تشغيل الإعداد
setupSupabase();