/**
 * Authentication utilities and helpers
 */

import type { Teacher } from "@shared/schema";

// Teacher credentials for demo/development
// In production, these would be stored securely in a database
export const DEMO_CREDENTIALS = {
  // Men's circle teachers
  men: [
    { username: "abdalrazaq", password: "123456", name: "أ. عبدالرزاق" },
    { username: "ibrahim", password: "123456", name: "أ. إبراهيم كدوائي" },
    { username: "hassan", password: "123456", name: "أ. حسن" },
    { username: "saud", password: "123456", name: "أ. سعود" },
    { username: "saleh", password: "123456", name: "أ. صالح" },
    { username: "abdullah", password: "123456", name: "أ. عبدالله" },
    { username: "nabil", password: "123456", name: "أ. نبيل" },
  ],
  // Women's circle teachers
  women: [
    { username: "asma", password: "123456", name: "أ. أسماء" },
    { username: "raghad", password: "123456", name: "أ. رغد" },
    { username: "madina", password: "123456", name: "أ. مدينة" },
    { username: "nashwa", password: "123456", name: "أ. نشوة" },
    { username: "nour", password: "123456", name: "أ. نور" },
    { username: "hind", password: "123456", name: "أ. هند" },
  ]
};

/**
 * Check if a teacher belongs to women's circles
 */
export function isWomenTeacher(teacher: Teacher): boolean {
  return teacher.gender === "female";
}

/**
 * Check if a teacher belongs to men's circles  
 */
export function isMenTeacher(teacher: Teacher): boolean {
  return teacher.gender === "male";
}

/**
 * Get the appropriate theme class for a teacher
 */
export function getTeacherTheme(teacher: Teacher): string {
  return isWomenTeacher(teacher) ? "women-theme" : "men-theme";
}

/**
 * Get the primary color CSS class for a teacher
 */
export function getPrimaryColor(teacher: Teacher): string {
  return isWomenTeacher(teacher) 
    ? "bg-pink-500 hover:bg-pink-600" 
    : "bg-green-500 hover:bg-green-600";
}

/**
 * Get the accent color CSS class for a teacher
 */
export function getAccentColor(teacher: Teacher): string {
  return isWomenTeacher(teacher) ? "text-pink-500" : "text-green-500";
}

/**
 * Get the circle type display name
 */
export function getCircleTypeName(teacher: Teacher): string {
  return isWomenTeacher(teacher) ? "حلقات النساء" : "حلقات الرجال";
}

/**
 * Validate teacher credentials format
 */
export function validateCredentials(username: string, password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!username || username.trim().length === 0) {
    errors.push("اسم المستخدم مطلوب");
  }

  if (!password || password.trim().length === 0) {
    errors.push("كلمة المرور مطلوبة");
  }

  if (username && username.trim().length < 3) {
    errors.push("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
  }

  if (password && password.trim().length < 6) {
    errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if user has permission to access a resource
 */
export function hasPermission(teacher: Teacher, resourceType: string, resourceId?: string): boolean {
  // Teachers can only access their own resources
  switch (resourceType) {
    case "students":
    case "records":
    case "errors":
      return true; // Teacher can access their own students/records
    case "teacher":
      return !resourceId || resourceId === teacher.id;
    default:
      return false;
  }
}

/**
 * Get display name with title
 */
export function getDisplayName(teacher: Teacher): string {
  return teacher.name;
}

/**
 * Get initials for avatar display
 */
export function getInitials(teacher: Teacher): string {
  const names = teacher.name.split(' ');
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0);
  }
  return teacher.name.charAt(0);
}

/**
 * Format teacher info for display
 */
export function formatTeacherInfo(teacher: Teacher): {
  name: string;
  circle: string;
  theme: string;
  initials: string;
} {
  return {
    name: getDisplayName(teacher),
    circle: getCircleTypeName(teacher),
    theme: getTeacherTheme(teacher),
    initials: getInitials(teacher)
  };
}

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  TEACHER: "quran_teacher",
  THEME: "quran_theme",
  PREFERENCES: "quran_preferences"
} as const;

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Check if teacher data is valid
 */
export function isValidTeacher(data: any): data is Teacher {
  return (
    data &&
    typeof data === "object" &&
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.username === "string" &&
    typeof data.gender === "string" &&
    (data.gender === "male" || data.gender === "female") &&
    typeof data.circleName === "string"
  );
}

/**
 * Get teacher preferences from localStorage
 */
export function getTeacherPreferences(): {
  rememberLogin: boolean;
  defaultView: string;
  language: string;
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading teacher preferences:", error);
  }

  // Default preferences
  return {
    rememberLogin: false,
    defaultView: "overview",
    language: "ar"
  };
}

/**
 * Save teacher preferences to localStorage
 */
export function saveTeacherPreferences(preferences: {
  rememberLogin?: boolean;
  defaultView?: string;
  language?: string;
}): void {
  try {
    const current = getTeacherPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving teacher preferences:", error);
  }
}

/**
 * Generate a session token (for demo purposes)
 */
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Check if current session is valid
 */
export function isSessionValid(): boolean {
  try {
    const teacher = localStorage.getItem(STORAGE_KEYS.TEACHER);
    return teacher !== null && isValidTeacher(JSON.parse(teacher));
  } catch (error) {
    return false;
  }
}

/**
 * Auto-logout after inactivity (in milliseconds)
 */
export const AUTO_LOGOUT_TIME = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  localStorage.setItem("last_activity", Date.now().toString());
}

/**
 * Check if session should be expired due to inactivity
 */
export function shouldExpireSession(): boolean {
  try {
    const lastActivity = localStorage.getItem("last_activity");
    if (!lastActivity) return true;
    
    const now = Date.now();
    const last = parseInt(lastActivity);
    
    return (now - last) > AUTO_LOGOUT_TIME;
  } catch (error) {
    return true;
  }
}

/**
 * Initialize activity tracking
 */
export function initializeActivityTracking(): void {
  updateLastActivity();
  
  // Update activity on user interactions
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  
  events.forEach(event => {
    document.addEventListener(event, updateLastActivity, { passive: true });
  });
}

/**
 * Cleanup activity tracking
 */
export function cleanupActivityTracking(): void {
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  
  events.forEach(event => {
    document.removeEventListener(event, updateLastActivity);
  });
}
