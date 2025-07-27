import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, UserCheck } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      {/* Header - Mobile Responsive */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 leading-tight">
                  نظام إدارة حلقات التحفيظ
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  جامع الرويشد - نظام إدارة حلقات تحفيظ القرآن الكريم
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Responsive */}
      <main className="max-w-6xl mx-auto mobile-container">
        {/* Welcome Section - Mobile Responsive */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            مرحباً بكم في نظام إدارة حلقات التحفيظ
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            منصة شاملة لإدارة حلقات تحفيظ القرآن الكريم، تتيح للمعلمين إدارة الطلاب وتتبع التقدم، 
            ولأولياء الأمور متابعة أبنائهم وتقييماتهم اليومية
          </p>
        </div>

        {/* Portal Cards - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Teacher Portal - Mobile Optimized */}
          <Card className="mobile-card shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0">
            <CardHeader className="text-center pb-4 px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="text-white text-2xl sm:text-3xl" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-gray-800 leading-tight">بوابة المعلمين</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-6">
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                إدارة الطلاب، تسجيل الحضور، تتبع التقدم في الحفظ، 
                وإدارة التقييمات اليومية للطلاب
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                <p>• إدارة بيانات الطلاب</p>
                <p>• تسجيل السجلات اليومية</p>
                <p>• متابعة أخطاء التلاوة</p>
                <p>• إنشاء التقارير والإحصائيات</p>
              </div>
              <Button 
                onClick={() => setLocation("/login")}
                className="mobile-button w-full bg-green-500 hover:bg-green-600 text-white font-semibold touch-target"
              >
                دخول المعلمين
              </Button>
            </CardContent>
          </Card>

          {/* Parents Portal - Mobile Optimized */}
          <Card className="mobile-card shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0">
            <CardHeader className="text-center pb-4 px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-white text-2xl sm:text-3xl" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-gray-800 leading-tight">بوابة أولياء الأمور</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-6">
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                متابعة تقدم الأبناء في الحفظ، الاطلاع على التقييمات، 
                ومتابعة السجلات اليومية والإنجازات
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                <p>• عرض تقدم جميع الطلاب</p>
                <p>• متابعة التقييمات اليومية</p>
                <p>• الاطلاع على الإحصائيات</p>
                <p>• تقارير الأداء الشاملة</p>
              </div>
              <Button 
                onClick={() => setLocation("/parents")}
                className="mobile-button w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold touch-target"
              >
                دخول أولياء الأمور
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section - Mobile Responsive */}
        <div className="mt-12 sm:mt-16 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">مميزات النظام</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <BookOpen className="text-blue-500 text-xl sm:text-2xl" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold mb-2">إدارة شاملة</h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                نظام متكامل لإدارة جميع جوانب حلقات التحفيظ
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <UserCheck className="text-green-500 text-xl sm:text-2xl" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold mb-2">سهولة الاستخدام</h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                واجهة بسيطة ومناسبة لجميع المستخدمين
              </p>
            </div>
            <div className="p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Users className="text-pink-500 text-xl sm:text-2xl" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold mb-2">متابعة مستمرة</h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                تتبع دقيق لتقدم الطلاب وتقييماتهم
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            © 2025 جامع الرويشد - نظام إدارة حلقات تحفيظ القرآن الكريم
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
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