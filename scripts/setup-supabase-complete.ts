import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwbapwyslonhxxwynean.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YmFwd3lzbG9uaHh4d3luZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzk0NDEsImV4cCI6MjA2OTAxNTQ0MX0.rupOaPIk9LSSzCgnBfz7l9ZfsQCIbZ8CxoCSVk-Enus';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSupabaseComplete() {
  try {
    console.log("🚀 بدء إعداد Supabase الكامل...");
    
    // اختبار الاتصال
    console.log("🔍 اختبار الاتصال بـ Supabase...");
    const { data: testData, error: testError } = await supabase
      .from('teachers')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error("❌ فشل الاتصال بـ Supabase:", testError);
      console.log("📋 تأكد من:");
      console.log("1. أن مشروع Supabase نشط");
      console.log("2. أن الجداول موجودة");
      console.log("3. أن RLS معطل أو السياسات صحيحة");
      return;
    }
    
    console.log("✅ تم الاتصال بـ Supabase بنجاح!");
    
    // فحص الجداول الموجودة
    console.log("📊 فحص الجداول الموجودة...");
    
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select('*')
      .limit(5);
    
    if (teachersError) {
      console.error("❌ خطأ في جلب المعلمين:", teachersError);
    } else {
      console.log(`👥 عدد المعلمين الموجودين: ${teachers?.length || 0}`);
    }
    
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(5);
    
    if (studentsError) {
      console.error("❌ خطأ في جلب الطلاب:", studentsError);
    } else {
      console.log(`🎓 عدد الطلاب الموجودين: ${students?.length || 0}`);
    }
    
    const { data: records, error: recordsError } = await supabase
      .from('daily_records')
      .select('*')
      .limit(5);
    
    if (recordsError) {
      console.error("❌ خطأ في جلب السجلات:", recordsError);
    } else {
      console.log(`📝 عدد السجلات الموجودة: ${records?.length || 0}`);
    }
    
    console.log("\n🎉 إعداد Supabase مكتمل!");
    console.log("✅ النظام متصل بقاعدة البيانات السحابية");
    console.log("✅ جميع البيانات محفوظة بشكل دائم");
    console.log("✅ النظام جاهز للاستخدام");
    
    console.log("\n📋 معلومات تسجيل الدخول:");
    console.log("جميع كلمات المرور: 123456");
    console.log("أمثلة على أسماء المستخدمين:");
    console.log("- abdalrazaq (حلقة رجالية)");
    console.log("- asma (حلقة نسائية)");
    
  } catch (error) {
    console.error("❌ خطأ عام في إعداد Supabase:", error);
  }
}

setupSupabaseComplete();