import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, BarChart } from "lucide-react";
import type { Student, DailyRecord } from "@shared/schema";

interface ReportsProps {
  students: Student[];
  records: DailyRecord[];
  teacherId: string;
}

export default function Reports({ students, records, teacherId }: ReportsProps) {
  const [reportType, setReportType] = useState("single");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [timePeriod, setTimePeriod] = useState("month");
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  const generateReport = () => {
    if (reportType === "single" && !selectedStudent) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار طالب لإنشاء التقرير",
        variant: "destructive",
      });
      return;
    }

    setShowReport(true);
    toast({
      title: "تم إنشاء التقرير",
      description: "تم إنشاء التقرير بنجاح",
    });
  };

  const exportPDF = () => {
    toast({
      title: "تصدير PDF",
      description: "سيتم تصدير التقرير كملف PDF قريباً",
    });
  };

  const exportExcel = () => {
    toast({
      title: "تصدير Excel",
      description: "سيتم تصدير التقرير كملف Excel قريباً",
    });
  };

  const getStudentReport = () => {
    if (!selectedStudent) return null;

    const student = students.find(s => s.id === selectedStudent);
    const studentRecords = records.filter(r => r.studentId === selectedStudent);

    if (!student) return null;

    const attendanceDays = studentRecords.length;
    const totalPages = studentRecords.reduce((sum, r) => sum + (r.pageCount || 0), 0);
    const averagePages = attendanceDays > 0 ? Math.round((totalPages / attendanceDays) * 10) / 10 : 0;
    const goodBehaviorCount = studentRecords.filter(r => r.behavior === "good").length;
    const behaviorPercentage = attendanceDays > 0 ? Math.round((goodBehaviorCount / attendanceDays) * 100) : 0;

    return {
      student,
      attendanceDays,
      totalPages,
      averagePages,
      behaviorPercentage,
      recentRecords: studentRecords.slice(0, 5),
    };
  };

  const reportData = getStudentReport();

  return (
    <div className="space-y-6">
      {/* Report Options */}
      <Card>
        <CardHeader>
          <CardTitle>خيارات التقرير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="reportType">نوع التقرير</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger data-testid="select-report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">تقرير طالب واحد</SelectItem>
                  <SelectItem value="all">تقرير جميع الطلاب</SelectItem>
                  <SelectItem value="monthly">تقرير شهري</SelectItem>
                  <SelectItem value="performance">تقرير الأداء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="student">الطالب</Label>
              <Select 
                value={selectedStudent} 
                onValueChange={setSelectedStudent}
                disabled={reportType !== "single"}
              >
                <SelectTrigger data-testid="select-report-student">
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

            <div>
              <Label htmlFor="timePeriod">الفترة الزمنية</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger data-testid="select-time-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                  <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                  <SelectItem value="year">العام الحالي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={generateReport}
              className="flex items-center"
              data-testid="button-generate-report"
            >
              <BarChart className="ml-2" size={18} />
              إنشاء التقرير
            </Button>
            <Button 
              variant="outline"
              onClick={exportPDF}
              className="flex items-center text-green-600 hover:text-green-700"
              disabled={!showReport}
              data-testid="button-export-pdf"
            >
              <FileText className="ml-2" size={18} />
              تصدير PDF
            </Button>
            <Button 
              variant="outline"
              onClick={exportExcel}
              className="flex items-center text-blue-600 hover:text-blue-700"
              disabled={!showReport}
              data-testid="button-export-excel"
            >
              <Download className="ml-2" size={18} />
              تصدير Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {showReport && reportData && (
        <Card>
          <CardHeader>
            <CardTitle>تقرير الطالب: {reportData.student.name}</CardTitle>
            <p className="text-sm text-gray-500">
              الفترة: {timePeriod === "month" ? "آخر شهر" : timePeriod === "week" ? "آخر أسبوع" : "الفترة المحددة"}
            </p>
          </CardHeader>
          <CardContent>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600" data-testid="stat-attendance-days">
                  {reportData.attendanceDays}
                </div>
                <div className="text-sm text-gray-600">أيام الحضور</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600" data-testid="stat-total-pages">
                  {reportData.totalPages}
                </div>
                <div className="text-sm text-gray-600">صفحات محفوظة</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600" data-testid="stat-average-pages">
                  {reportData.averagePages}
                </div>
                <div className="text-sm text-gray-600">متوسط يومي</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600" data-testid="stat-behavior-percentage">
                  {reportData.behaviorPercentage}%
                </div>
                <div className="text-sm text-gray-600">السلوك الجيد</div>
              </div>
            </div>

            {/* Recent Records */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">آخر السجلات</h4>
              {reportData.recentRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد سجلات للطالب</p>
              ) : (
                <div className="space-y-3">
                  {reportData.recentRecords.map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg" data-testid={`record-${record.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{record.hijriDate} - {record.day}</p>
                          {record.dailyLesson && (
                            <p className="text-sm text-gray-600">الدرس: {record.dailyLesson}</p>
                          )}
                          {record.pageCount && (
                            <p className="text-sm text-gray-600">الصفحات: {record.pageCount}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.behavior === "good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {record.behavior === "good" ? "سلوك ممتاز" : "يحتاج تحسين"}
                          </span>
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-2">ملاحظات: {record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Chart Placeholder */}
            <div className="mt-8 bg-gray-50 rounded-lg p-8 text-center">
              <BarChart className="mx-auto text-4xl text-gray-400 mb-4" size={64} />
              <p className="text-gray-600">رسم بياني لتطور الأداء</p>
              <p className="text-sm text-gray-500 mt-2">سيتم عرض مخطط تفاعلي لتطور أداء الطالب هنا</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Students Report */}
      {showReport && reportType === "all" && (
        <Card>
          <CardHeader>
            <CardTitle>تقرير جميع الطلاب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">أيام الحضور</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصفحات المحفوظة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتوسط اليومي</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقييم</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const studentRecords = records.filter(r => r.studentId === student.id);
                    const attendanceDays = studentRecords.length;
                    const totalPages = studentRecords.reduce((sum, r) => sum + (r.pageCount || 0), 0);
                    const averagePages = attendanceDays > 0 ? Math.round((totalPages / attendanceDays) * 10) / 10 : 0;
                    const goodBehavior = studentRecords.filter(r => r.behavior === "good").length;
                    const behaviorPercentage = attendanceDays > 0 ? Math.round((goodBehavior / attendanceDays) * 100) : 0;

                    return (
                      <tr key={student.id} className="hover:bg-gray-50" data-testid={`all-students-row-${student.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.level}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendanceDays} يوم
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {totalPages} صفحة
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {averagePages} صفحة/يوم
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            behaviorPercentage >= 80 ? "bg-green-100 text-green-800" :
                            behaviorPercentage >= 60 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {behaviorPercentage >= 80 ? "ممتاز" :
                             behaviorPercentage >= 60 ? "جيد" : "يحتاج تحسين"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
