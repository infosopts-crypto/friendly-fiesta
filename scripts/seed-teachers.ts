import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { teachers } from "../shared/schema";
import { randomUUID } from "crypto";

const connectionString = process.env.DATABASE_URL!;
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

async function seedTeachers() {
  try {
    console.log("🌱 بدء إدخال بيانات المعلمين...");
    
    for (const teacher of teachersData) {
      await db.insert(teachers).values({
        id: randomUUID(),
        ...teacher
      });
      console.log(`✅ تم إضافة المعلم/ة: ${teacher.name}`);
    }
    
    console.log("🎉 تم إدخال جميع بيانات المعلمين بنجاح!");
    
    // عرض النتائج
    const result = await db.select().from(teachers);
    console.log(`📊 إجمالي المعلمين في قاعدة البيانات: ${result.length}`);
    console.log(`👨‍🏫 معلمين الرجال: ${result.filter(t => t.gender === 'male').length}`);
    console.log(`👩‍🏫 معلمات النساء: ${result.filter(t => t.gender === 'female').length}`);
    
  } catch (error) {
    console.error("❌ خطأ في إدخال البيانات:", error);
  } finally {
    await client.end();
  }
}

seedTeachers();