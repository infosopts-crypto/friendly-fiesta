import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  BookOpen, 
  Calendar, 
  User, 
  TrendingUp, 
  Award,
  CheckCircle,
  AlertCircle,
  Users,
  Phone,
  Mail
} from "lucide-react";
import { useAuth } from "@/lib/auth.tsx";
// Loading component
function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
import type { Student, DailyRecord } from "@shared/schema";

export default function ParentDashboard() {
  const [, setLocation] = useLocation();
  const { parent, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!parent) {
      setLocation("/login");
    }
  }, [parent, setLocation]);

  const { data: children = [], isLoading: childrenLoading } = useQuery<Student[]>({
    queryKey: ["/api/parents", parent?.id, "students"],
    enabled: !!parent,
  });

  const { data: allRecords = [], isLoading: recordsLoading } = useQuery<DailyRecord[]>({
    queryKey: ["/api/students", "records", "all"],
    queryFn: async () => {
      if (!children.length) return [];
      
      const allChildRecords = await Promise.all(
        children.map(child => 
          fetch(`/api/students/${child.id}/records`).then(res => res.json())
        )
      );
      
      return allChildRecords.flat();
    },
    enabled: !!parent && children.length > 0,
  });

  if (!parent) {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const getRecentRecords = (studentId: string, limit: number = 5) => {
    return allRecords
      .filter(record => record.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  };

  const getStudentStats = (studentId: string) => {
    const studentRecords = allRecords.filter(record => record.studentId === studentId);
    const totalRecords = studentRecords.length;
    const averageScore = totalRecords > 0 
      ? studentRecords.reduce((sum, record) => sum + (record.totalScore || 0), 0) / totalRecords
      : 0;
    
    const goodBehaviorCount = studentRecords.filter(record => record.behavior === 'good').length;
    const behaviorPercentage = totalRecords > 0 ? (goodBehaviorCount / totalRecords) * 100 : 0;

    return {
      totalRecords,
      averageScore: Math.round(averageScore * 10) / 10,
      behaviorPercentage: Math.round(behaviorPercentage)
    };
  };

  const getBehaviorColor = (behavior: string | null) => {
    switch (behavior) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'bad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'مبتدئ';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'متقدم';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 arabic-text">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  بوابة أولياء الأمور
                </h1>
                <p className="text-sm text-gray-600">جامع الرويشد</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {parent.fatherName}
                </p>
                <p className="text-xs text-gray-500">ولي أمر</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <LogOut size={16} />
                <span>تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {childrenLoading ? (
          <Loading />
        ) : children.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد أطفال مسجلين
              </h3>
              <p className="text-gray-500">
                يرجى التواصل مع إدارة المسجد لتسجيل أطفالكم في الحلقات
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Parent Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <User className="w-5 h-5" />
                  <span>معلومات ولي الأمر</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">اسم الأب</p>
                    <p className="text-lg font-semibold">{parent.fatherName}</p>
                  </div>
                  {parent.motherName && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">اسم الأم</p>
                      <p className="text-lg font-semibold">{parent.motherName}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{parent.phone}</span>
                  </div>
                  {parent.email && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{parent.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Children Cards */}
            {children.map((child) => {
              const stats = getStudentStats(child.id);
              const recentRecords = getRecentRecords(child.id);

              return (
                <Card key={child.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{child.name}</CardTitle>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Badge className={getLevelColor(child.level)}>
                            {getLevelText(child.level)}
                          </Badge>
                          <span className="text-sm text-gray-600">العمر: {child.age} سنة</span>
                          {child.phone && (
                            <span className="text-sm text-gray-600">الهاتف: {child.phone}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">إجمالي السجلات: {stats.totalRecords}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">متوسط الدرجات: {stats.averageScore}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">السلوك الجيد: {stats.behaviorPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center space-x-2 space-x-reverse">
                      <Calendar className="w-4 h-4" />
                      <span>السجلات الحديثة</span>
                    </h4>

                    {recordsLoading ? (
                      <div className="text-center py-4">
                        <Loading />
                      </div>
                    ) : recentRecords.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p>لا توجد سجلات حديثة</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {recentRecords.map((record) => (
                            <div key={record.id} className="border rounded-lg p-4 bg-white">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-medium">{record.hijriDate}</p>
                                  <p className="text-sm text-gray-600">{record.day}</p>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  {record.totalScore && (
                                    <Badge variant="secondary">
                                      الدرجة: {record.totalScore}
                                    </Badge>
                                  )}
                                  {record.behavior && (
                                    <Badge className={getBehaviorColor(record.behavior)}>
                                      {record.behavior === 'good' ? 'جيد' : 'يحتاج تحسين'}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {record.dailyLesson && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    الدرس اليومي: {record.dailyLesson}
                                    {record.lessonFromVerse && record.lessonToVerse && (
                                      <span className="text-gray-500">
                                        {" "}(من الآية {record.lessonFromVerse} إلى {record.lessonToVerse})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}

                              {record.dailyReview && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600">
                                    المراجعة: {record.dailyReview}
                                  </p>
                                </div>
                              )}

                              {record.pageCount && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600">
                                    عدد الصفحات: {record.pageCount}
                                  </p>
                                </div>
                              )}

                              {record.errors && (
                                <div className="mb-2">
                                  <p className="text-sm text-red-600">
                                    الأخطاء: {record.errors}
                                  </p>
                                </div>
                              )}

                              {record.notes && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600">
                                    ملاحظات: {record.notes}
                                  </p>
                                </div>
                              )}

                              {record.listenerName && (
                                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>المستمع: {record.listenerName}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}