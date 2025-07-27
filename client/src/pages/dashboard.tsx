import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  FileText, 
  Bell, 
  LogOut,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChartPie,
  Check,
  User
} from "lucide-react";
import StudentForm from "@/components/student-form";
import DailyRecordForm from "@/components/daily-record-form";
import QuranViewer from "@/components/quran-viewer";
import Reports from "@/components/reports";
import Loading from "@/components/ui/loading";
import type { Student, DailyRecord } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { teacher, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!teacher) {
      setLocation("/login");
    }
  }, [teacher, setLocation]);

  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/teachers", teacher?.id, "students"],
    enabled: !!teacher,
  });

  const { data: records = [], isLoading: recordsLoading } = useQuery<DailyRecord[]>({
    queryKey: ["/api/teachers", teacher?.id, "records"],
    enabled: !!teacher,
  });

  if (!teacher) {
    return <Loading />;
  }

  const isWomen = teacher.gender === "female";
  const themeClass = isWomen ? "women-theme" : "men-theme";
  const primaryColor = isWomen ? "bg-pink-500 hover:bg-pink-600" : "bg-green-500 hover:bg-green-600";
  const accentColor = isWomen ? "text-pink-500" : "text-green-500";

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || student.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const statsData = {
    totalStudents: students.length,
    attendedToday: records.filter(r => {
      const today = new Date().toDateString();
      return r.createdAt && new Date(r.createdAt).toDateString() === today;
    }).length,
    averagePages: records.length > 0 ? Math.round((records.reduce((sum, r) => sum + (r.pageCount || 0), 0) / records.length) * 10) / 10 : 0,
    todayRecords: records.filter(r => {
      const today = new Date().toDateString();
      return r.createdAt && new Date(r.createdAt).toDateString() === today;
    }).length,
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${themeClass}`}>
      {/* Navigation Header - Mobile Responsive */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${primaryColor} rounded-lg flex items-center justify-center ml-2 sm:ml-3`}>
                <BookOpen className="text-white" size={16} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight" data-testid="text-teacher-name">
                  {teacher.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {isWomen ? "حلقات النساء" : "حلقات الرجال"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <Button variant="ghost" size="sm" className="touch-target" data-testid="button-notifications">
                <Bell size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="touch-target" data-testid="button-logout">
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden bg-white border-b">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === "overview" ? `${accentColor} border-b-2 border-current` : "text-gray-500"}`}
              onClick={() => setActiveTab("overview")}
              data-testid="tab-overview"
            >
              <ChartPie size={16} className="ml-2" />
              عامة
            </button>
            <button
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === "students" ? `${accentColor} border-b-2 border-current` : "text-gray-500"}`}
              onClick={() => setActiveTab("students")}
              data-testid="tab-students"
            >
              <Users size={16} className="ml-2" />
              الطلاب
            </button>
            <button
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === "records" ? `${accentColor} border-b-2 border-current` : "text-gray-500"}`}
              onClick={() => setActiveTab("records")}
              data-testid="tab-records"
            >
              <ClipboardList size={16} className="ml-2" />
              السجلات
            </button>
            <button
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === "quran" ? `${accentColor} border-b-2 border-current` : "text-gray-500"}`}
              onClick={() => setActiveTab("quran")}
              data-testid="tab-quran"
            >
              <BookOpen size={16} className="ml-2" />
              القرآن
            </button>
            <button
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === "reports" ? `${accentColor} border-b-2 border-current` : "text-gray-500"}`}
              onClick={() => setActiveTab("reports")}
              data-testid="tab-reports"
            >
              <FileText size={16} className="ml-2" />
              التقارير
            </button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <nav className="space-y-2">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "overview" ? primaryColor : ""}`}
                onClick={() => setActiveTab("overview")}
                data-testid="tab-overview"
              >
                <ChartPie className="ml-3" size={18} />
                نظرة عامة
              </Button>
              <Button
                variant={activeTab === "students" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "students" ? primaryColor : ""}`}
                onClick={() => setActiveTab("students")}
                data-testid="tab-students"
              >
                <Users className="ml-3" size={18} />
                إدارة الطلاب
              </Button>
              <Button
                variant={activeTab === "records" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "records" ? primaryColor : ""}`}
                onClick={() => setActiveTab("records")}
                data-testid="tab-records"
              >
                <ClipboardList className="ml-3" size={18} />
                السجلات اليومية
              </Button>
              <Button
                variant={activeTab === "quran" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "quran" ? primaryColor : ""}`}
                onClick={() => setActiveTab("quran")}
                data-testid="tab-quran"
              >
                <BookOpen className="ml-3" size={18} />
                المصحف الإلكتروني
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "reports" ? primaryColor : ""}`}
                onClick={() => setActiveTab("reports")}
                data-testid="tab-reports"
              >
                <FileText className="ml-3" size={18} />
                التقارير
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content - Mobile Responsive */}
        <div className="flex-1 mobile-container lg:p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">نظرة عامة</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  مرحباً بك {teacher.name}، إليك ملخص حلقتك اليوم
                </p>
              </div>

              {/* Stats Cards - Mobile Responsive Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <Card className="mobile-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900" data-testid="stat-total-students">
                          {statsData.totalStudents}
                        </p>
                      </div>
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 ${primaryColor} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                        <Users className={accentColor} size={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mobile-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">حضروا اليوم</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900" data-testid="stat-attended-today">
                          {statsData.attendedToday}
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="text-green-600" size={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">متوسط الحفظ</p>
                        <p className="text-2xl font-bold text-gray-900" data-testid="stat-average-pages">
                          {statsData.averagePages}
                        </p>
                        <p className="text-xs text-gray-500">صفحة يومياً</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-blue-600" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">سجلات اليوم</p>
                        <p className="text-2xl font-bold text-gray-900" data-testid="stat-today-records">
                          {statsData.todayRecords}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ClipboardList className="text-purple-600" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>النشاط الأخير</CardTitle>
                </CardHeader>
                <CardContent>
                  {recordsLoading ? (
                    <Loading />
                  ) : records.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">لا توجد أنشطة حديثة</p>
                  ) : (
                    <div className="space-y-4">
                      {records.slice(0, 5).map((record) => {
                        const student = students.find(s => s.id === record.studentId);
                        return (
                          <div key={record.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 ${primaryColor} bg-opacity-10 rounded-full flex items-center justify-center ml-3`}>
                                <User className={accentColor} size={16} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {student?.name || "طالب غير معروف"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {record.dailyLesson && `أكمل حفظ ${record.dailyLesson}`}
                                  {record.pageCount && ` - ${record.pageCount} صفحة`}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">
                              {record.createdAt && new Date(record.createdAt).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة الطلاب</h2>
                  <p className="text-gray-600">إدارة قائمة طلاب حلقتك</p>
                </div>
                <Button 
                  className={primaryColor}
                  onClick={() => {
                    setEditingStudent(null);
                    setShowStudentForm(true);
                  }}
                  data-testid="button-add-student"
                >
                  <Plus className="ml-2" size={18} />
                  إضافة طالب جديد
                </Button>
              </div>

              {/* Search and Filter */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          placeholder="اكتب اسم الطالب..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pr-10"
                          data-testid="input-search-students"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-48">
                      <Select value={levelFilter} onValueChange={setLevelFilter}>
                        <SelectTrigger data-testid="select-level-filter">
                          <SelectValue placeholder="المستوى" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع المستويات</SelectItem>
                          <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                          <SelectItem value="متوسط">متوسط</SelectItem>
                          <SelectItem value="متقدم">متقدم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students List */}
              <Card>
                <CardContent className="p-0">
                  {studentsLoading ? (
                    <div className="p-8">
                      <Loading />
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">
                        {searchTerm || levelFilter !== "all" ? "لم يتم العثور على طلاب مطابقين للبحث" : "لا يوجد طلاب مسجلين في حلقتك"}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              اسم الطالب
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              العمر
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              المستوى
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              رقم الهاتف
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50" data-testid={`row-student-${student.id}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`w-10 h-10 ${primaryColor} bg-opacity-10 rounded-full flex items-center justify-center ml-3`}>
                                    <span className={`${accentColor} font-semibold`}>
                                      {student.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900" data-testid={`text-student-name-${student.id}`}>
                                      {student.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-student-age-${student.id}`}>
                                {student.age} سنة
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  student.level === "متقدم" ? "bg-green-100 text-green-800" :
                                  student.level === "متوسط" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-blue-100 text-blue-800"
                                }`} data-testid={`text-student-level-${student.id}`}>
                                  {student.level}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`text-student-phone-${student.id}`}>
                                {student.phone || "غير محدد"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={accentColor}
                                    data-testid={`button-view-student-${student.id}`}
                                  >
                                    <Eye size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-900"
                                    onClick={() => {
                                      setEditingStudent(student);
                                      setShowStudentForm(true);
                                    }}
                                    data-testid={`button-edit-student-${student.id}`}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-900"
                                    data-testid={`button-delete-student-${student.id}`}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Records Tab */}
          {activeTab === "records" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">السجلات اليومية</h2>
                  <p className="text-gray-600">تسجيل وإدارة الأنشطة اليومية للطلاب</p>
                </div>
                <Button 
                  className={primaryColor}
                  onClick={() => setShowRecordForm(true)}
                  data-testid="button-add-record"
                >
                  <Plus className="ml-2" size={18} />
                  سجل جديد
                </Button>
              </div>

              <DailyRecordForm 
                isOpen={showRecordForm} 
                onClose={() => setShowRecordForm(false)}
                teacherId={teacher.id}
                students={students}
              />
            </div>
          )}

          {/* Quran Tab */}
          {activeTab === "quran" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">المصحف الإلكتروني</h2>
                <p className="text-gray-600">استخدم المصحف لتمييز أخطاء الطلاب وتتبع مواضع الضعف</p>
              </div>

              <QuranViewer students={students} />
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">التقارير</h2>
                <p className="text-gray-600">إنشاء وتصدير تقارير مفصلة لأداء الطلاب</p>
              </div>

              <Reports 
                students={students} 
                records={records}
                teacherId={teacher.id}
              />
            </div>
          )}
        </div>
      </div>

      {/* Student Form Modal */}
      <StudentForm
        isOpen={showStudentForm}
        onClose={() => {
          setShowStudentForm(false);
          setEditingStudent(null);
        }}
        teacherId={teacher.id}
        student={editingStudent}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
          <p className="text-gray-300 text-sm">
            © 2025 جامع الرويشد - نظام إدارة حلقات تحفيظ القرآن الكريم
          </p>
          <p className="text-gray-400 text-xs">
            صُنع بواسطة{" "}
            <a 
              href="https://t.me/rnp_e" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              عبدالله بن محمد
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
