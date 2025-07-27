// Quran API service for fetching complete Quran data
export interface QuranVerse {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
  };
  page: number;
  juz: number;
  hizbQuarter: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: QuranVerse[];
}

export interface QuranData {
  surahs: QuranSurah[];
}

// Cache for storing Quran data
let cachedQuran: QuranData | null = null;

export async function getCompleteQuran(): Promise<QuranData> {
  if (cachedQuran) {
    return cachedQuran;
  }

  try {
    console.log("🕌 جاري تحميل القرآن الكريم...");
    const response = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.code === 200 && result.data) {
      cachedQuran = result.data;
      console.log(`✅ تم تحميل القرآن الكريم: ${cachedQuran.surahs.length} سورة`);
      return cachedQuran;
    } else {
      throw new Error('Invalid response format from Quran API');
    }
  } catch (error) {
    console.error('Error fetching Quran:', error);
    
    // Fallback to CDN
    try {
      console.log("🔄 جاري المحاولة مع مصدر بديل...");
      const fallbackResponse = await fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json');
      const fallbackData = await fallbackResponse.json();
      
      // Transform the data to match our interface
      const transformedData: QuranData = {
        surahs: fallbackData.map((surah: any, index: number) => ({
          number: index + 1,
          name: surah.name || `سورة ${index + 1}`,
          englishName: surah.transliteration || `Surah ${index + 1}`,
          englishNameTranslation: surah.translation || `Surah ${index + 1}`,
          numberOfAyahs: surah.verses ? surah.verses.length : 0,
          revelationType: surah.type || 'Meccan',
          ayahs: surah.verses ? surah.verses.map((verse: any, verseIndex: number) => ({
            number: verseIndex + 1,
            text: verse.text || verse.arabic || '',
            surah: {
              number: index + 1,
              name: surah.name || `سورة ${index + 1}`,
              englishName: surah.transliteration || `Surah ${index + 1}`,
              numberOfAyahs: surah.verses.length
            },
            page: 1, // Default page
            juz: 1, // Default juz
            hizbQuarter: 1 // Default hizbQuarter
          })) : []
        }))
      };
      
      cachedQuran = transformedData;
      console.log(`✅ تم تحميل القرآن الكريم من المصدر البديل: ${transformedData.surahs.length} سورة`);
      return transformedData;
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
      throw new Error('Failed to fetch Quran from all sources');
    }
  }
}

export async function getSurah(surahNumber: number): Promise<QuranSurah | null> {
  const quran = await getCompleteQuran();
  return quran.surahs.find(surah => surah.number === surahNumber) || null;
}

export async function getVerse(surahNumber: number, verseNumber: number): Promise<QuranVerse | null> {
  const surah = await getSurah(surahNumber);
  if (!surah) return null;
  
  return surah.ayahs.find(ayah => ayah.number === verseNumber) || null;
}

export async function searchVerses(searchText: string): Promise<QuranVerse[]> {
  const quran = await getCompleteQuran();
  const results: QuranVerse[] = [];
  
  for (const surah of quran.surahs) {
    for (const ayah of surah.ayahs) {
      if (ayah.text.includes(searchText)) {
        results.push(ayah);
      }
    }
  }
  
  return results;
}

// Predefined Surah names in Arabic
export const surahNames = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
  "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
  "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
  "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
  "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
  "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
  "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
  "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
  "المسد", "الإخلاص", "الفلق", "الناس"
];