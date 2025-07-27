// Fix for deployment issues - ensures teachers are always available
import { storage } from "./storage";

export async function ensureTeachersExist() {
  try {
    const teachers = await storage.getAllTeachers();
    
    if (teachers.length === 0) {
      console.log("🔧 No teachers found, creating default teachers for deployment...");
      
      // Create a minimal set of teachers for deployment
      const defaultTeachers = [
        { username: "abdullah", password: "123456", name: "أ. عبدالله", gender: "male", circleName: "حلقة عبدالله" },
        { username: "asma", password: "123456", name: "أ. أسماء", gender: "female", circleName: "حلقة أسماء" },
      ];
      
      for (const teacherData of defaultTeachers) {
        try {
          await storage.createTeacher(teacherData as any);
          console.log(`✅ Created teacher: ${teacherData.name}`);
        } catch (error) {
          console.error(`❌ Failed to create teacher ${teacherData.name}:`, error);
        }
      }
      
      const newCount = await storage.getAllTeachers();
      console.log(`✅ Teachers created: ${newCount.length}`);
      return true;
    }
    
    console.log(`✅ Teachers already exist: ${teachers.length}`);
    return true;
  } catch (error) {
    console.error("❌ Error ensuring teachers exist:", error);
    return false;
  }
}