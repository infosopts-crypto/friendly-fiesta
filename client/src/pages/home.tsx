import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, UserCheck } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="text-white text-2xl" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  نظام إدارة حلقات التحفيظ
                </h1>
                <p className="text-gray-600 text-sm">
                  جامع الرويشد - نظام إدارة حلقات تحفيظ القرآن الكريم
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            مرحباً بكم في نظام إدارة حلقات التحفيظ
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            منصة شاملة لإدارة حلقات تحفيظ القرآن الكريم، تتيح للمعلمين إدارة الطلاب وتتبع التقدم، 
            ولأولياء الأمور متابعة أبنائهم وتقييماتهم اليومية
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Teacher Portal */}
          <Card className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="text-white text-3xl" />
              </div>
              <CardTitle className="text-2xl text-gray-800">بوابة المعلمين</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 mb-6">
                إدارة الطلاب، تسجيل الحضور، تتبع التقدم في الحفظ، 
                وإدارة التقييمات اليومية للطلاب
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>• إدارة بيانات الطلاب</p>
                <p>• تسجيل السجلات اليومية</p>
                <p>• متابعة أخطاء التلاوة</p>
                <p>• إنشاء التقارير والإحصائيات</p>
              </div>
              <Button 
                onClick={() => setLocation("/login")}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
              >
                دخول المعلمين
              </Button>
            </CardContent>
          </Card>

          {/* Parents Portal */}
          <Card className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-white text-3xl" />
              </div>
              <CardTitle className="text-2xl text-gray-800">بوابة أولياء الأمور</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 mb-6">
                متابعة تقدم الأبناء في الحفظ، الاطلاع على التقييمات، 
                ومتابعة السجلات اليومية والإنجازات
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>• عرض تقدم جميع الطلاب</p>
                <p>• متابعة التقييمات اليومية</p>
                <p>• الاطلاع على الإحصائيات</p>
                <p>• تقارير الأداء الشاملة</p>
              </div>
              <Button 
                onClick={() => setLocation("/parents")}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3"
              >
                دخول أولياء الأمور
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">مميزات النظام</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="text-blue-500 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold mb-2">إدارة شاملة</h4>
              <p className="text-gray-600">
                نظام متكامل لإدارة جميع جوانب حلقات التحفيظ
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="text-green-500 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold mb-2">سهولة الاستخدام</h4>
              <p className="text-gray-600">
                واجهة بسيطة ومناسبة لجميع المستخدمين
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="text-pink-500 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold mb-2">متابعة مستمرة</h4>
              <p className="text-gray-600">
                تتبع دقيق لتقدم الطلاب وتقييماتهم
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
          <p className="text-gray-300">
            © 2025 جامع الرويشد - نظام إدارة حلقات تحفيظ القرآن الكريم
          </p>
          <p className="text-gray-400 text-sm">
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