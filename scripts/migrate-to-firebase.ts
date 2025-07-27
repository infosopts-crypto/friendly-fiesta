import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

const teachers = [
  // Men's circle teachers
  { username: "abdalrazaq", password: "123456", name: "أ. عبدالرزاق", gender: "male", circleName: "حلقة عبدالرزاق" },
  { username: "ibrahim", password: "123456", name: "أ. إبراهيم كدوائي", gender: "male", circleName: "حلقة إبراهيم كدوائي" },
  { username: "hassan", password: "123456", name: "أ. حسن", gender: "male", circleName: "حلقة حسن" },
  { username: "saud", password: "123456", name: "أ. سعود", gender: "male", circleName: "حلقة سعود" },
  { username: "saleh", password: "123456", name: "أ. صالح", gender: "male", circleName: "حلقة صالح" },
  { username: "abdullah", password: "123456", name: "أ. عبدالله", gender: "male", circleName: "حلقة عبدالله" },
  { username: "nabil", password: "123456", name: "أ. نبيل", gender: "male", circleName: "حلقة نبيل" },
  
  // Women's circle teachers  
  { username: "asma", password: "123456", name: "أ. أسماء", gender: "female", circleName: "حلقة أسماء" },
  { username: "raghad", password: "123456", name: "أ. رغد", gender: "female", circleName: "حلقة رغد" },
  { username: "madina", password: "123456", name: "أ. مدينة", gender: "female", circleName: "حلقة مدينة" },
  { username: "nashwa", password: "123456", name: "أ. نشوة", gender: "female", circleName: "حلقة نشوة" },
  { username: "nour", password: "123456", name: "أ. نور", gender: "female", circleName: "حلقة نور" },
  { username: "hind", password: "123456", name: "أ. هند", gender: "female", circleName: "حلقة هند" },
];

async function migrateTeachersToFirebase() {
  try {
    console.log("بدء نقل المعلمين إلى Firebase...");
    
    // Clear existing teachers (optional)
    const teachersCollection = collection(db, "teachers");
    const existingTeachers = await getDocs(teachersCollection);
    console.log(`عدد المعلمين الموجودين: ${existingTeachers.size}`);
    
    // Add teachers to Firebase
    for (const teacher of teachers) {
      try {
        const docRef = await addDoc(teachersCollection, {
          ...teacher,
          createdAt: new Date().toISOString()
        });
        console.log(`تم إضافة المعلم ${teacher.name} بمعرف: ${docRef.id}`);
      } catch (error) {
        console.error(`خطأ في إضافة المعلم ${teacher.name}:`, error);
      }
    }
    
    console.log("تم الانتهاء من نقل المعلمين إلى Firebase!");
    
    // Verify migration
    const updatedTeachers = await getDocs(teachersCollection);
    console.log(`إجمالي المعلمين في Firebase: ${updatedTeachers.size}`);
    
  } catch (error) {
    console.error("خطأ في نقل البيانات إلى Firebase:", error);
  }
}

// Clean all students (demo data removal)
async function cleanDemoStudents() {
  try {
    console.log("إزالة الطلاب التجريبيين...");
    
    const studentsCollection = collection(db, "students");
    const existingStudents = await getDocs(studentsCollection);
    
    for (const studentDoc of existingStudents.docs) {
      await deleteDoc(doc(db, "students", studentDoc.id));
      console.log(`تم حذف الطالب: ${studentDoc.id}`);
    }
    
    console.log("تم حذف جميع الطلاب التجريبيين");
  } catch (error) {
    console.error("خطأ في حذف الطلاب التجريبيين:", error);
  }
}

// Run migration
async function runMigration() {
  await cleanDemoStudents();
  await migrateTeachersToFirebase();
}

// Auto-run migration
runMigration().then(() => {
  console.log("تمت العملية بنجاح");
  process.exit(0);
}).catch((error) => {
  console.error("خطأ في العملية:", error);
  process.exit(1);
});

export { migrateTeachersToFirebase, cleanDemoStudents };