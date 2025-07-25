import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Student, QuranError, InsertQuranError } from "@shared/schema";

interface QuranViewerProps {
  students: Student[];
}

const surahs = [
  { name: "الفاتحة", pages: [1, 2] },
  { name: "البقرة", pages: [2, 49] },
  { name: "آل عمران", pages: [50, 76] },
  { name: "النساء", pages: [77, 106] },
  // Add more surahs as needed
];

const sampleVerses = [
  { number: 8, text: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ" },
  { number: 9, text: "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ" },
  { number: 10, text: "فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُم عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ" },
  { number: 11, text: "وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا إِنَّمَا نَحْنُ مُصْلِحُونَ" },
  { number: 12, text: "أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ" },
];

export default function QuranViewer({ students }: QuranViewerProps) {
  const [selectedSurah, setSelectedSurah] = useState("البقرة");
  const [currentPage, setCurrentPage] = useState(2);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [highlightMode, setHighlightMode] = useState<"repeated" | "previous" | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<Record<number, "repeated" | "previous">>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    if (!selectedStudent || !highlightMode) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار طالب ونوع التمييز أولاً",
        variant: "destructive",
      });
      return;
    }

    // Check if verse already has error
    const existingError = quranErrors.find(
      error => error.verse === verseNumber && error.pageNumber === currentPage
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
        surah: selectedSurah,
        verse: verseNumber,
        pageNumber: currentPage,
        errorType: highlightMode,
      });
      setHighlightedVerses(prev => ({
        ...prev,
        [verseNumber]: highlightMode,
      }));
    }
  }, [selectedStudent, highlightMode, currentPage, selectedSurah, quranErrors, createErrorMutation, deleteErrorMutation, toast]);

  const clearAllHighlights = () => {
    // Delete all errors for current page
    const pageErrors = quranErrors.filter(error => error.pageNumber === currentPage);
    pageErrors.forEach(error => {
      deleteErrorMutation.mutate(error.id);
    });
    setHighlightedVerses({});
  };

  const getVerseClassName = (verseNumber: number) => {
    const error = quranErrors.find(
      error => error.verse === verseNumber && error.pageNumber === currentPage
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

  const nextPage = () => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
      setHighlightedVerses({});
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setHighlightedVerses({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Quran Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="surah">السورة</Label>
                <Select value={selectedSurah} onValueChange={setSelectedSurah}>
                  <SelectTrigger className="w-48" data-testid="select-surah">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {surahs.map(surah => (
                      <SelectItem key={surah.name} value={surah.name}>
                        {surah.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="page">الصفحة</Label>
                <Input
                  id="page"
                  type="number"
                  min="1"
                  max="604"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  data-testid="input-page-number"
                />
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
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">سورة {selectedSurah}</h3>
            <p className="text-gray-600">الصفحة {currentPage}</p>
          </div>
          
          <div className="quran-text text-center leading-loose space-y-4" data-testid="quran-content">
            {sampleVerses.map((verse) => (
              <p key={verse.number} className="mb-4">
                <span
                  className={getVerseClassName(verse.number)}
                  onClick={() => handleVerseClick(verse.number)}
                  data-testid={`verse-${verse.number}`}
                >
                  {verse.text}
                </span>
                <span className="islamic-gold mr-2">({verse.number})</span>
              </p>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center"
              data-testid="button-prev-page"
            >
              <ChevronRight className="ml-2" size={18} />
              الصفحة السابقة
            </Button>
            <span className="text-gray-600 text-sm" data-testid="text-page-info">
              صفحة {currentPage} من 604
            </span>
            <Button
              variant="ghost"
              onClick={nextPage}
              disabled={currentPage === 604}
              className="flex items-center"
              data-testid="button-next-page"
            >
              الصفحة التالية
              <ChevronLeft className="mr-2" size={18} />
            </Button>
          </div>
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
