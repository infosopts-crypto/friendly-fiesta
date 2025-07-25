import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getHijriDate } from "@/lib/arabic";
import { insertDailyRecordSchema } from "@shared/schema";
import type { Student, InsertDailyRecord } from "@shared/schema";
import { z } from "zod";

const recordFormSchema = insertDailyRecordSchema.extend({
  studentId: z.string().min(1, "يجب اختيار طالب"),
  hijriDate: z.string().min(1, "التاريخ الهجري مطلوب"),
  day: z.string().min(1, "اليوم مطلوب"),
});

interface DailyRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  students: Student[];
}

export default function DailyRecordForm({ isOpen, onClose, teacherId, students }: DailyRecordFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof recordFormSchema>>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      studentId: "",
      teacherId,
      hijriDate: getHijriDate(),
      day: "السبت",
      dailyLesson: "",
      lessonFromVerse: undefined,
      lessonToVerse: undefined,
      lastFivePages: "",
      dailyReview: "",
      reviewFrom: "",
      reviewTo: "",
      pageCount: undefined,
      errors: "",
      reminders: "",
      listenerName: "",
      behavior: "good",
      other: "good",
      totalScore: undefined,
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertDailyRecord) => {
      const response = await apiRequest("POST", "/api/records", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers", teacherId, "records"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ السجل اليومي بنجاح",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ السجل",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof recordFormSchema>) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-record-form">
        <DialogHeader>
          <DialogTitle>سجل يومي جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Date and Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات أساسية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hijriDate">التاريخ الهجري</Label>
                  <Input
                    id="hijriDate"
                    {...form.register("hijriDate")}
                    placeholder="15 ربيع الأول 1445"
                    className="text-right"
                    data-testid="input-hijri-date"
                  />
                  {form.formState.errors.hijriDate && (
                    <p className="text-sm text-red-600">{form.formState.errors.hijriDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day">اليوم</Label>
                  <Select
                    value={form.watch("day")}
                    onValueChange={(value) => form.setValue("day", value)}
                  >
                    <SelectTrigger data-testid="select-day">
                      <SelectValue placeholder="اختر اليوم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="السبت">السبت</SelectItem>
                      <SelectItem value="الأحد">الأحد</SelectItem>
                      <SelectItem value="الاثنين">الاثنين</SelectItem>
                      <SelectItem value="الثلاثاء">الثلاثاء</SelectItem>
                      <SelectItem value="الأربعاء">الأربعاء</SelectItem>
                      <SelectItem value="الخميس">الخميس</SelectItem>
                      <SelectItem value="الجمعة">الجمعة</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.day && (
                    <p className="text-sm text-red-600">{form.formState.errors.day.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">اختر الطالب</Label>
                  <Select
                    value={form.watch("studentId")}
                    onValueChange={(value) => form.setValue("studentId", value)}
                  >
                    <SelectTrigger data-testid="select-student">
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.studentId && (
                    <p className="text-sm text-red-600">{form.formState.errors.studentId.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Memorization and Review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">القسم الأول - بيانات الحفظ والمراجعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyLesson">الدرس اليومي (اسم السورة)</Label>
                  <Input
                    id="dailyLesson"
                    {...form.register("dailyLesson")}
                    placeholder="سورة البقرة"
                    className="text-right"
                    data-testid="input-daily-lesson"
                  />
                </div>

                <div className="space-y-2">
                  <Label>من - إلى (آيات الدرس)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      {...form.register("lessonFromVerse", { valueAsNumber: true })}
                      placeholder="من آية"
                      className="text-right"
                      data-testid="input-lesson-from-verse"
                    />
                    <Input
                      type="number"
                      {...form.register("lessonToVerse", { valueAsNumber: true })}
                      placeholder="إلى آية"
                      className="text-right"
                      data-testid="input-lesson-to-verse"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastFivePages">آخر خمس صفحات تمت قراءتها</Label>
                  <Input
                    id="lastFivePages"
                    {...form.register("lastFivePages")}
                    placeholder="من الصفحة X إلى Y"
                    className="text-right"
                    data-testid="input-last-five-pages"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyReview">المراجعة اليومية (10 صفحات أو أكثر)</Label>
                  <Input
                    id="dailyReview"
                    {...form.register("dailyReview")}
                    placeholder="الصفحات المراجعة"
                    className="text-right"
                    data-testid="input-daily-review"
                  />
                </div>

                <div className="space-y-2">
                  <Label>من - إلى (آيات أو صفحات)</Label>
                  <div className="flex gap-2">
                    <Input
                      {...form.register("reviewFrom")}
                      placeholder="من"
                      className="text-right"
                      data-testid="input-review-from"
                    />
                    <Input
                      {...form.register("reviewTo")}
                      placeholder="إلى"
                      className="text-right"
                      data-testid="input-review-to"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageCount">عدد الصفحات</Label>
                  <Input
                    id="pageCount"
                    type="number"
                    {...form.register("pageCount", { valueAsNumber: true })}
                    placeholder="0"
                    className="text-right"
                    data-testid="input-page-count"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="errors">الأخطاء</Label>
                  <Textarea
                    id="errors"
                    {...form.register("errors")}
                    placeholder="اكتب الأخطاء المرصودة..."
                    className="h-24 resize-none text-right"
                    data-testid="textarea-errors"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="reminders">التنبيهات</Label>
                  <Textarea
                    id="reminders"
                    {...form.register("reminders")}
                    placeholder="اكتب التنبيهات..."
                    className="h-24 resize-none text-right"
                    data-testid="textarea-reminders"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listenerName">اسم المستمع (المعلم أو المساعدة)</Label>
                  <Input
                    id="listenerName"
                    {...form.register("listenerName")}
                    placeholder="أ. عبدالرزاق"
                    className="text-right"
                    data-testid="input-listener-name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Evaluation and Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">القسم الثاني - التقييم والسلوك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>السلوك</Label>
                    <RadioGroup
                      value={form.watch("behavior") || "good"}
                      onValueChange={(value) => form.setValue("behavior", value)}
                      className="flex gap-4"
                      data-testid="radio-group-behavior"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="good" id="behavior-good" />
                        <Label htmlFor="behavior-good" className="text-green-600">✅ ممتاز</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="bad" id="behavior-bad" />
                        <Label htmlFor="behavior-bad" className="text-red-600">❌ يحتاج تحسين</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>أخرى</Label>
                    <RadioGroup
                      value={form.watch("other") || "good"}
                      onValueChange={(value) => form.setValue("other", value)}
                      className="flex gap-4"
                      data-testid="radio-group-other"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="good" id="other-good" />
                        <Label htmlFor="other-good" className="text-green-600">✅ جيد</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="bad" id="other-bad" />
                        <Label htmlFor="other-bad" className="text-red-600">❌ ضعيف</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalScore">المجموع (يُدخل يدويًا)</Label>
                  <Input
                    id="totalScore"
                    type="number"
                    {...form.register("totalScore", { valueAsNumber: true })}
                    placeholder="0"
                    className="text-right"
                    data-testid="input-total-score"
                  />
                  <p className="text-xs text-gray-500">ملاحظة: لا يتم احتساب المجموع تلقائياً</p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">الملاحظات</Label>
                  <Textarea
                    id="notes"
                    {...form.register("notes")}
                    placeholder="اكتب أي ملاحظات إضافية..."
                    className="h-32 resize-none text-right"
                    data-testid="textarea-notes"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={createMutation.isPending}
              data-testid="button-cancel-record"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              data-testid="button-save-record"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ السجل"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
