import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertStudentSchema } from "@shared/schema";
import type { Student, InsertStudent } from "@shared/schema";
import { z } from "zod";

const studentFormSchema = insertStudentSchema.extend({
  name: z.string().min(1, "اسم الطالب مطلوب"),
  age: z.coerce.number().min(5, "العمر يجب أن يكون 5 سنوات على الأقل").max(100, "العمر غير صالح"),
  phone: z.string().optional(),
  level: z.enum(["مبتدئ", "متوسط", "متقدم"], { required_error: "المستوى مطلوب" }),
});

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  student?: Student | null;
}

export default function StudentForm({ isOpen, onClose, teacherId, student }: StudentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!student;

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      age: 18,
      phone: "",
      level: "مبتدئ",
      teacherId,
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        age: student.age,
        phone: student.phone || "",
        level: student.level as "مبتدئ" | "متوسط" | "متقدم",
        teacherId: student.teacherId,
      });
    } else {
      form.reset({
        name: "",
        age: 18,
        phone: "",
        level: "مبتدئ",
        teacherId,
      });
    }
  }, [student, teacherId, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertStudent) => {
      const response = await apiRequest("POST", `/api/teachers/${teacherId}/students`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers", teacherId, "students"] });
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة الطالب الجديد بنجاح",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة الطالب",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertStudent>) => {
      const response = await apiRequest("PUT", `/api/students/${student?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers", teacherId, "students"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات الطالب بنجاح",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث بيانات الطالب",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof studentFormSchema>) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-student-form">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الطالب الكامل</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="أدخل اسم الطالب"
              className="text-right"
              data-testid="input-student-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">العمر</Label>
            <Input
              id="age"
              type="number"
              {...form.register("age")}
              placeholder="العمر"
              className="text-right"
              data-testid="input-student-age"
            />
            {form.formState.errors.age && (
              <p className="text-sm text-red-600">{form.formState.errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              placeholder="05xxxxxxxx"
              className="text-right"
              data-testid="input-student-phone"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">المستوى</Label>
            <Select
              value={form.watch("level")}
              onValueChange={(value) => form.setValue("level", value as "مبتدئ" | "متوسط" | "متقدم")}
            >
              <SelectTrigger data-testid="select-student-level">
                <SelectValue placeholder="اختر المستوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                <SelectItem value="متوسط">متوسط</SelectItem>
                <SelectItem value="متقدم">متقدم</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.level && (
              <p className="text-sm text-red-600">{form.formState.errors.level.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              data-testid="button-cancel-student"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-save-student"
            >
              {isLoading ? "جاري الحفظ..." : isEditing ? "تحديث الطالب" : "إضافة الطالب"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
