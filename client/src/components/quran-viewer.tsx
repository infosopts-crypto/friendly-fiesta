import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Search, BookOpen } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getCompleteQuran, getSurah, searchVerses, surahNames, type QuranSurah, type QuranVerse } from "@/lib/quran-api";
import type { Student, QuranError, InsertQuranError } from "@shared/schema";

interface QuranViewerProps {
  students: Student[];
}

export default function QuranViewer({ students }: QuranViewerProps) {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(2); // البقرة
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [highlightMode, setHighlightMode] = useState<"repeated" | "previous" | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<Record<number, "repeated" | "previous">>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuranVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSurah, setCurrentSurah] = useState<QuranSurah | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load selected surah
  useEffect(() => {
    const loadSurah = async () => {
      setIsLoading(true);
      try {
        const surah = await getSurah(selectedSurahNumber);
        setCurrentSurah(surah);
      } catch (error) {
        toast({
          title: "خطأ في التحميل",
          description: "فشل في تحميل السورة",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSurah();
  }, [selectedSurahNumber, toast]);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchVerses(searchQuery);
      setSearchResults(results);
      toast({
        title: "البحث مكتمل",
        description: `تم العثور على ${results.length} آية`,
      });
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: "فشل في البحث عن الآيات",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const { data: quranErrors = [] } = useQuery<QuranError[]>({
    queryKey: ["/api/students", selectedStudent, "quran-errors"],
    enabled: !!selectedStudent,
  });

  const createErrorMutation = useMutation({
    mutationFn: async (data: InsertQuranError) => {
      const response = await apiRequest("POST", "/api/quran-errors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students", selectedStudent, "quran-errors"] });
      toast({
        title: "تم حفظ التمييز",
        description: "تم حفظ تمييز الخطأ بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ التمييز",
        variant: "destructive",
      });
    },
  });

  const deleteErrorMutation = useMutation({
    mutationFn: async (errorId: string) => {
      const response = await apiRequest("DELETE", `/api/quran-errors/${errorId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students", selectedStudent, "quran-errors"] });
      toast({
        title: "تم مسح التمييز",
        description: "تم مسح تمييز الخطأ بنجاح",
      });
    },
  });

  const handleVerseClick = useCallback((verseNumber: number) => {
    if (!selectedStudent || !highlightMode || !currentSurah) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار طالب ونوع التمييز أولاً",
        variant: "destructive",
      });
      return;
    }

    // Check if verse already has error
    const existingError = quranErrors.find(
      error => error.verse === verseNumber && error.surah === currentSurah.name
    );

    if (existingError) {
      // Remove existing error
      deleteErrorMutation.mutate(existingError.id);
      setHighlightedVerses(prev => {
        const newState = { ...prev };
        delete newState[verseNumber];
        return newState;
      });
    } else {
      // Add new error
      createErrorMutation.mutate({
        studentId: selectedStudent,
        surah: currentSurah.name,
        verse: verseNumber,
        pageNumber: 1, // Default page for now
        errorType: highlightMode,
      });
      setHighlightedVerses(prev => ({
        ...prev,
        [verseNumber]: highlightMode,
      }));
    }
  }, [selectedStudent, highlightMode, currentSurah, quranErrors, createErrorMutation, deleteErrorMutation, toast]);

  const clearAllHighlights = () => {
    if (!currentSurah) return;
    
    // Delete all errors for current surah
    const surahErrors = quranErrors.filter(error => error.surah === currentSurah.name);
    surahErrors.forEach(error => {
      deleteErrorMutation.mutate(error.id);
    });
    setHighlightedVerses({});
  };

  const getVerseClassName = (verseNumber: number) => {
    if (!currentSurah) return "hover:bg-gray-100 cursor-pointer transition-colors px-1 rounded inline-block";
    
    const error = quranErrors.find(
      error => error.verse === verseNumber && error.surah === currentSurah.name
    );
    
    let baseClass = "hover:bg-gray-100 cursor-pointer transition-colors px-1 rounded inline-block";
    
    if (error) {
      if (error.errorType === "repeated") {
        baseClass += " error-highlight-red";
      } else if (error.errorType === "previous") {
        baseClass += " error-highlight-yellow";
      }
    }
    
    return baseClass;
  };

  const nextSurah = () => {
    if (selectedSurahNumber < 114) {
      setSelectedSurahNumber(prev => prev + 1);
      setHighlightedVerses({});
    }
  };

  const prevSurah = () => {
    if (selectedSurahNumber > 1) {
      setSelectedSurahNumber(prev => prev - 1);
      setHighlightedVerses({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">البحث في القرآن</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search"
                  placeholder="ابحث عن آية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  <Search className="ml-2" size={16} />
                  {isSearching ? "جاري البحث..." : "بحث"}
                </Button>
              </div>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">نتائج البحث ({searchResults.length}):</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.slice(0, 5).map((verse, index) => (
                  <div key={index} className="text-sm p-2 bg-white rounded border">
                    <p className="text-right">{verse.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      سورة {verse.surah.name} - آية {verse.number}
                    </p>
                  </div>
                ))}
                {searchResults.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    وعثر على {searchResults.length - 5} نتيجة أخرى...
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quran Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="surah">السورة</Label>
                <Select value={selectedSurahNumber.toString()} onValueChange={(value) => setSelectedSurahNumber(parseInt(value))}>
                  <SelectTrigger className="w-48" data-testid="select-surah">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {surahNames.map((name, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {index + 1}. {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="student">الطالب</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-48" data-testid="select-student-quran">
                    <SelectValue placeholder="اختر الطالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">أدوات التمييز:</span>
              <Button
                variant={highlightMode === "repeated" ? "default" : "outline"}
                size="sm"
                className={highlightMode === "repeated" ? "bg-red-500 hover:bg-red-600" : "bg-red-100 text-red-600 hover:bg-red-200"}
                onClick={() => setHighlightMode(highlightMode === "repeated" ? null : "repeated")}
                data-testid="button-repeated-error"
              >
                🔴 خطأ مكرر
              </Button>
              <Button
                variant={highlightMode === "previous" ? "default" : "outline"}
                size="sm"
                className={highlightMode === "previous" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"}
                onClick={() => setHighlightMode(highlightMode === "previous" ? null : "previous")}
                data-testid="button-previous-error"
              >
                🟡 خطأ سابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={clearAllHighlights}
                data-testid="button-clear-highlights"
              >
                مسح التمييز
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quran Display */}
      <Card className="quran-bg">
        <CardContent className="p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto mb-4 animate-pulse" size={48} />
              <p className="text-gray-600">جاري تحميل السورة...</p>
            </div>
          ) : currentSurah ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  سورة {currentSurah.name}
                </h3>
                <p className="text-gray-600">
                  {currentSurah.numberOfAyahs} آية - {currentSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </p>
              </div>
              
              <div className="quran-text text-right leading-loose space-y-4" data-testid="quran-content" dir="rtl">
                {currentSurah.ayahs.map((verse) => (
                  <p key={verse.number} className="mb-4 text-xl">
                    <span
                      className={getVerseClassName(verse.number)}
                      onClick={() => handleVerseClick(verse.number)}
                      data-testid={`verse-${verse.number}`}
                    >
                      {verse.text}
                    </span>
                    <span className="islamic-gold mr-2 text-base">﴿{verse.number}﴾</span>
                  </p>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={prevSurah}
                  disabled={selectedSurahNumber === 1}
                  className="flex items-center"
                  data-testid="button-prev-surah"
                >
                  <ChevronRight className="ml-2" size={18} />
                  السورة السابقة
                </Button>
                <span className="text-gray-600 text-sm" data-testid="text-surah-info">
                  سورة {selectedSurahNumber} من 114
                </span>
                <Button
                  variant="ghost"
                  onClick={nextSurah}
                  disabled={selectedSurahNumber === 114}
                  className="flex items-center"
                  data-testid="button-next-surah"
                >
                  السورة التالية
                  <ChevronLeft className="mr-2" size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-red-600">فشل في تحميل السورة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Legend */}
      <Card>
        <CardHeader>
          <CardTitle>دليل الألوان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="error-highlight-red px-3 py-1 rounded ml-3">نص تجريبي</span>
              <span className="text-sm text-gray-600">خطأ مكرر (أحمر) - يحتاج تركيز إضافي</span>
            </div>
            <div className="flex items-center">
              <span className="error-highlight-yellow px-3 py-1 rounded ml-3">نص تجريبي</span>
              <span className="text-sm text-gray-600">خطأ سابق (أصفر) - تم تصحيحه مسبقاً</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
