import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { randomUUID } from "crypto";

const teachersData = [
  // حلقات الرجال
  { name: "أ. عبدالرزاق", username: "abdalrazaq", password: "123456", gender: "male" as const, circleName: "حلقة عبدالرزاق" },
  { name: "أ. إبراهيم كدوائي", username: "ibrahim", password: "123456", gender: "male" as const, circleName: "حلقة إبراهيم كدوائي" },
  { name: "أ. حسن", username: "hassan", password: "123456", gender: "male" as const, circleName: "حلقة حسن" },
  { name: "أ. سعود", username: "saud", password: "123456", gender: "male" as const, circleName: "حلقة سعود" },
  { name: "أ. صالح", username: "saleh", password: "123456", gender: "male" as const, circleName: "حلقة صالح" },
  { name: "أ. عبدالله", username: "abdullah", password: "123456", gender: "male" as const, circleName: "حلقة عبدالله" },
  { name: "أ. نبيل", username: "nabil", password: "123456", gender: "male" as const, circleName: "حلقة نبيل" },
  
  // حلقات النساء
  { name: "أ. أسماء", username: "asma", password: "123456", gender: "female" as const, circleName: "حلقة أسماء" },
  { name: "أ. رغد", username: "raghad", password: "123456", gender: "female" as const, circleName: "حلقة رغد" },
  { name: "أ. مدينة", username: "madina", password: "123456", gender: "female" as const, circleName: "حلقة مدينة" },
  { name: "أ. نشوة", username: "nashwa", password: "123456", gender: "female" as const, circleName: "حلقة نشوة" },
  { name: "أ. نور", username: "nour", password: "123456", gender: "female" as const, circleName: "حلقة نور" },
  { name: "أ. هند", username: "hind", password: "123456", gender: "female" as const, circleName: "حلقة هند" },
];

async function seedFirebaseTeachers() {
  try {
    console.log("🌱 بدء إدخال بيانات المعلمين إلى Firebase...");
    
    let addedCount = 0;
    
    for (const teacher of teachersData) {
      try {
        const docRef = await addDoc(collection(db, "teachers"), {
          id: randomUUID(),
          ...teacher,
          createdAt: new Date()
        });
        console.log(`✅ تم إضافة المعلم/ة: ${teacher.name} (${docRef.id})`);
        addedCount++;
      } catch (error) {
        console.error(`❌ خطأ في إضافة ${teacher.name}:`, error);
      }
    }
    
    console.log(`🎉 تم إدخال ${addedCount} من أصل ${teachersData.length} معلم/ة بنجاح!`);
    console.log(`👨‍🏫 معلمين الرجال: ${teachersData.filter(t => t.gender === 'male').length}`);
    console.log(`👩‍🏫 معلمات النساء: ${teachersData.filter(t => t.gender === 'female').length}`);
    
    console.log("\n📋 معلومات تسجيل الدخول:");
    console.log("جميع كلمات المرور: 123456");
    console.log("\nأسماء المستخدمين:");
    teachersData.forEach(teacher => {
      console.log(`- ${teacher.name}: ${teacher.username}`);
    });
    
  } catch (error) {
    console.error("❌ خطأ عام في إدخال البيانات:", error);
  }
}

seedFirebaseTeachers();