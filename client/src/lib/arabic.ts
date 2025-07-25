/**
 * Utility functions for Arabic and Islamic features
 */

// Arabic day names
const ARABIC_DAYS = [
  "الأحد",
  "الاثنين", 
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];

// Arabic month names (Hijri)
const HIJRI_MONTHS = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الثانية",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة"
];

// Arabic numerals
const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert English numerals to Arabic numerals
 */
export function toArabicNumerals(text: string): string {
  return text.replace(/[0-9]/g, (digit) => ARABIC_NUMERALS[parseInt(digit)]);
}

/**
 * Convert Arabic numerals to English numerals
 */
export function toEnglishNumerals(text: string): string {
  return text.replace(/[٠-٩]/g, (digit) => {
    return ARABIC_NUMERALS.indexOf(digit).toString();
  });
}

/**
 * Get current Arabic day name
 */
export function getCurrentArabicDay(): string {
  const today = new Date();
  return ARABIC_DAYS[today.getDay()];
}

/**
 * Get approximate Hijri date (simplified conversion)
 * Note: This is a simplified conversion and may not be 100% accurate
 * For production use, consider using a proper Islamic calendar library
 */
export function getHijriDate(): string {
  const today = new Date();
  
  // Simplified Hijri conversion (approximate)
  // The Islamic calendar started on July 16, 622 CE
  const islamicEpoch = new Date(622, 6, 16);
  const daysDiff = Math.floor((today.getTime() - islamicEpoch.getTime()) / (1000 * 60 * 60 * 24));
  
  // Average Islamic year is about 354.37 days
  const islamicYears = Math.floor(daysDiff / 354.37);
  const currentHijriYear = 1 + islamicYears;
  
  // Simplified month and day calculation
  const daysInYear = daysDiff - (islamicYears * 354.37);
  const monthIndex = Math.floor(daysInYear / 29.5) % 12;
  const dayInMonth = Math.floor(daysInYear % 29.5) + 1;
  
  return `${dayInMonth} ${HIJRI_MONTHS[monthIndex]} ${currentHijriYear}`;
}

/**
 * Format a Hijri date string
 */
export function formatHijriDate(day: number, month: string, year: number): string {
  return `${day} ${month} ${year}`;
}

/**
 * Get Arabic month name by index (0-11)
 */
export function getHijriMonth(index: number): string {
  return HIJRI_MONTHS[index] || HIJRI_MONTHS[0];
}

/**
 * Parse a Hijri date string and return components
 */
export function parseHijriDate(dateString: string): { day: number; month: string; year: number } | null {
  try {
    const parts = dateString.trim().split(' ');
    if (parts.length !== 3) return null;
    
    const day = parseInt(toEnglishNumerals(parts[0]));
    const month = parts[1];
    const year = parseInt(toEnglishNumerals(parts[2]));
    
    if (isNaN(day) || isNaN(year)) return null;
    
    return { day, month, year };
  } catch (error) {
    return null;
  }
}

/**
 * Validate if a string is a valid Hijri date format
 */
export function isValidHijriDate(dateString: string): boolean {
  const parsed = parseHijriDate(dateString);
  if (!parsed) return false;
  
  const { day, month, year } = parsed;
  
  // Basic validation
  if (day < 1 || day > 30) return false;
  if (year < 1 || year > 2000) return false;
  if (!HIJRI_MONTHS.includes(month)) return false;
  
  return true;
}

/**
 * Get the next Hijri date
 */
export function getNextHijriDate(currentDate: string): string {
  const parsed = parseHijriDate(currentDate);
  if (!parsed) return getHijriDate();
  
  let { day, month, year } = parsed;
  
  day += 1;
  
  // Simple month rollover (assuming 29-30 days per month)
  if (day > 29) {
    day = 1;
    const monthIndex = HIJRI_MONTHS.indexOf(month);
    if (monthIndex === 11) {
      month = HIJRI_MONTHS[0];
      year += 1;
    } else {
      month = HIJRI_MONTHS[monthIndex + 1];
    }
  }
  
  return formatHijriDate(day, month, year);
}

/**
 * Format Arabic text for RTL display
 */
export function formatArabicText(text: string): string {
  // Ensure proper RTL markers and formatting
  return `\u202B${text}\u202C`;
}

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text);
}

/**
 * Clean and normalize Arabic text
 */
export function normalizeArabicText(text: string): string {
  return text
    .trim()
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Normalize Arabic characters
    .replace(/ي/g, 'ي')
    .replace(/ك/g, 'ك');
}

/**
 * Get Surah names in Arabic (commonly used surahs for memorization)
 */
export const COMMON_SURAHS = [
  "الفاتحة",
  "البقرة", 
  "آل عمران",
  "النساء",
  "المائدة",
  "الأنعام",
  "الأعراف",
  "الأنفال",
  "التوبة",
  "يونس",
  "هود",
  "يوسف",
  "الرعد",
  "إبراهيم",
  "الحجر",
  "النحل",
  "الإسراء",
  "الكهف",
  "مريم",
  "طه",
  "الأنبياء",
  "الحج",
  "المؤمنون",
  "النور",
  "الفرقان",
  "الشعراء",
  "النمل",
  "القصص",
  "العنكبوت",
  "الروم"
];

/**
 * Get student levels in Arabic
 */
export const STUDENT_LEVELS = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط", 
  ADVANCED: "متقدم"
} as const;

/**
 * Get behavior assessment options in Arabic
 */
export const BEHAVIOR_OPTIONS = {
  GOOD: "ممتاز",
  NEEDS_IMPROVEMENT: "يحتاج تحسين"
} as const;
