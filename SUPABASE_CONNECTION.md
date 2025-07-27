# معلومات اتصال Supabase

## المفاتيح المتوفرة:
- **VITE_SUPABASE_URL:** https://xwbapwyslonhxxwynean.supabase.co
- **VITE_SUPABASE_ANON_KEY:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YmFwd3lzbG9uaHh4d3luZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzk0NDEsImV4cCI6MjA2OTAxNTQ0MX0.rupOaPIk9LSSzCgnBfz7l9ZfsQCIbZ8CxoCSVk-Enus

## DATABASE_URL المطلوب:
لاستكمال الإعداد، نحتاج لـ DATABASE_URL الذي يحتوي على:
- Host: xwbapwyslonhxxwynean.supabase.co
- كلمة مرور قاعدة البيانات

## كيفية الحصول على DATABASE_URL:
1. اذهب إلى لوحة تحكم Supabase
2. اضغط "Connect" في الشريط العلوي
3. اختر "Connection string" → "Transaction pooler"
4. انسخ الرابط وأضفه كـ DATABASE_URL في Secrets

مثال على الشكل المطلوب:
```
postgresql://postgres.xwbapwyslonhxxwynean:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```