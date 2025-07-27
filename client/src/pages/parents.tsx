import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Search, 
  ArrowRight, 
  Calendar,
  Star,
  TrendingUp,
  User,
  Home
} from "lucide-react";
import Loading from "@/components/ui/loading";
import type { Student, DailyRecord } from "@shared/schema";

export default function ParentsPortal() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Get all students (public access)
  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  // Get records for selected student
  const { data: studentRecords = [], isLoading: recordsLoading } = useQuery<DailyRecord[]>({
    queryKey: ["/api/students", selectedStudent?.id, "records"],
    enabled: !!selectedStudent,
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || student.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner": return "مبتدئ";
      case "intermediate": return "متوسط";
      case "advanced": return "متقدم";
      default: return level;
    }
  };

  if (studentsLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  بوابة أولياء الأمور
                </h1>
                <p className="text-gray-600 text-sm">
                  متابعة تقدم جميع الطلاب في حلقات التحفيظ
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => setLocation("/")}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Home size={16} />
              <span>الرئيسية</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedStudent ? (
          <>
            {/* Search and Filter Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="البحث عن طالب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="تصفية حسب المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستويات</SelectItem>
                    <SelectItem value="beginner">مبتدئ</SelectItem>
                    <SelectItem value="intermediate">متوسط</SelectItem>
                    <SelectItem value="advanced">متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-gray-600">
                <p>إجمالي الطلاب: <span className="font-semibold text-pink-600">{filteredStudents.length}</span></p>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student) => (
                <Card 
                  key={student.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200 hover:border-pink-300"
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                      <Badge className={getLevelBadgeColor(student.level)}>
                        {getLevelText(student.level)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>العمر: {student.age} سنة</p>
                      {student.phone && (
                        <p>الهاتف: {student.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">عرض التفاصيل</span>
                      <ArrowRight className="text-pink-500" size={16} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500">لم يتم العثور على طلاب يطابقون معايير البحث</p>
              </div>
            )}
          </>
        ) : (
          /* Student Details View */
          <div className="space-y-6">
            {/* Student Header */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedStudent(null)}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <ArrowRight size={16} />
                <span>العودة لقائمة الطلاب</span>
              </Button>
            </div>

            {/* Student Info Card */}
            <Card className="border-pink-200">
              <CardHeader>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User className="text-white text-2xl" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedStudent.name}</CardTitle>
                    <div className="flex items-center space-x-4 space-x-reverse mt-2">
                      <Badge className={getLevelBadgeColor(selectedStudent.level)}>
                        {getLevelText(selectedStudent.level)}
                      </Badge>
                      <span className="text-gray-600">العمر: {selectedStudent.age} سنة</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Recent Records */}
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="text-pink-500" />
                  <span>السجلات اليومية الأخيرة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <Loading />
                ) : studentRecords.length > 0 ? (
                  <div className="space-y-4">
                    {studentRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="p-4 border border-pink-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800">{record.hijriDate}</span>
                          <span className="text-sm text-gray-500">{record.day}</span>
                        </div>
                        {record.dailyLesson && (
                          <p className="text-sm text-gray-600 mb-1">
                            الدرس اليومي: {record.dailyLesson}
                          </p>
                        )}
                        {record.behavior && (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="text-sm text-gray-600">السلوك:</span>
                            <Badge className={record.behavior === "good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {record.behavior === "good" ? "جيد" : "يحتاج تحسين"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500">لا توجد سجلات يومية متاحة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}