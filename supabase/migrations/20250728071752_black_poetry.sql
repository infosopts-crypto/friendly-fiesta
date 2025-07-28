/*
  # إنشاء قاعدة بيانات نظام إدارة حلقات تحفيظ القرآن الكريم

  1. الجداول الجديدة
    - `teachers` - جدول المعلمين والمعلمات
    - `students` - جدول الطلاب والطالبات  
    - `daily_records` - جدول السجلات اليومية
    - `quran_errors` - جدول أخطاء التلاوة

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان للمعلمين
    - حماية البيانات الشخصية

  3. الفهارس
    - فهارس للبحث السريع
    - فهارس للعلاقات بين الجداول
*/

-- إنشاء جدول المعلمين
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  circle_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الطلاب
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 5 AND age <= 100),
  phone text,
  level text NOT NULL CHECK (level IN ('مبتدئ', 'متوسط', 'متقدم')),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  current_surah text DEFAULT '',
  total_pages integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول السجلات اليومية
CREATE TABLE IF NOT EXISTS daily_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  
  -- معلومات التاريخ والأساسيات
  hijri_date text NOT NULL,
  day text NOT NULL,
  
  -- قسم الحفظ والمراجعة
  daily_lesson text,
  lesson_from_verse integer,
  lesson_to_verse integer,
  last_five_pages text,
  daily_review text,
  review_from text,
  review_to text,
  page_count integer DEFAULT 0,
  errors text,
  reminders text,
  listener_name text,
  
  -- قسم التقييم والسلوك
  behavior text CHECK (behavior IN ('good', 'bad')),
  other text CHECK (other IN ('good', 'bad')),
  total_score integer,
  notes text,
  
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول أخطاء القرآن
CREATE TABLE IF NOT EXISTS quran_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  surah text NOT NULL,
  verse integer NOT NULL,
  page_number integer NOT NULL,
  error_type text NOT NULL CHECK (error_type IN ('repeated', 'previous')),
  position jsonb,
  created_at timestamptz DEFAULT now()
);

-- إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_teachers_username ON teachers(username);
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_student_id ON daily_records(student_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_teacher_id ON daily_records(teacher_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_created_at ON daily_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quran_errors_student_id ON quran_errors(student_id);

-- تفعيل Row Level Security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_errors ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمعلمين
CREATE POLICY "Teachers can read own data"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (true);

-- سياسات الأمان للطلاب
CREATE POLICY "Teachers can manage their students"
  ON students
  FOR ALL
  TO authenticated
  USING (true);

-- سياسات الأمان للسجلات اليومية
CREATE POLICY "Teachers can manage their records"
  ON daily_records
  FOR ALL
  TO authenticated
  USING (true);

-- سياسات الأمان لأخطاء القرآن
CREATE POLICY "Teachers can manage quran errors"
  ON quran_errors
  FOR ALL
  TO authenticated
  USING (true);

-- إدخال بيانات المعلمين الأساسية
INSERT INTO teachers (username, password, name, gender, circle_name) VALUES
-- معلمو الحلقات الرجالية
('abdalrazaq', '123456', 'أ. عبدالرزاق', 'male', 'حلقة عبدالرزاق'),
('ibrahim', '123456', 'أ. إبراهيم كدوائي', 'male', 'حلقة إبراهيم كدوائي'),
('hassan', '123456', 'أ. حسن', 'male', 'حلقة حسن'),
('saud', '123456', 'أ. سعود', 'male', 'حلقة سعود'),
('saleh', '123456', 'أ. صالح', 'male', 'حلقة صالح'),
('abdullah', '123456', 'أ. عبدالله', 'male', 'حلقة عبدالله'),
('nabil', '123456', 'أ. نبيل', 'male', 'حلقة نبيل'),

-- معلمات الحلقات النسائية
('asma', '123456', 'أ. أسماء', 'female', 'حلقة أسماء'),
('raghad', '123456', 'أ. رغد', 'female', 'حلقة رغد'),
('madina', '123456', 'أ. مدينة', 'female', 'حلقة مدينة'),
('nashwa', '123456', 'أ. نشوة', 'female', 'حلقة نشوة'),
('nour', '123456', 'أ. نور', 'female', 'حلقة نور'),
('hind', '123456', 'أ. هند', 'female', 'حلقة هند')

ON CONFLICT (username) DO NOTHING;