# 🔥 دليل إعداد Firebase للنظام

## ⚠️ خطأ حالي: Firestore API غير مفعل

الخطأ: `PERMISSION_DENIED: Cloud Firestore API has not been used in project rwesh-98a7b`

## 🔧 خطوات الحل:

### 1️⃣ تفعيل Firestore API
اذهب إلى الرابط التالي لتفعيل Firestore API:
```
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=rwesh-98a7b
```

أو:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. اختر مشروع `rwesh-98a7b`
3. ابحث عن "Firestore" في شريط البحث
4. اضغط على "Cloud Firestore API"
5. اضغط "Enable"

### 2️⃣ إعداد Firestore Database
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `rwesh-98a7b`
3. اذهب إلى "Firestore Database"
4. اضغط "Create database"
5. اختر "Start in test mode" (للتطوير)
6. اختر المنطقة الأقرب

### 3️⃣ تحديث إعدادات الأمان (Rules)
في Firestore Rules، استخدم القواعد التالية للتطوير:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بالقراءة والكتابة للجميع (للتطوير فقط)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4️⃣ تفعيل Firebase في النظام
بعد إكمال الخطوات أعلاه، قم بتعديل `server/storage.ts`:

```typescript
// استبدل هذا السطر:
export const storage = new MemStorage();

// بهذا السطر:
export const storage = new FirebaseStorage();
```

### 5️⃣ إدخال بيانات المعلمين
```bash
tsx scripts/seed-firebase.ts
```

## 📋 الحالة الحالية:
- ✅ Firebase معُرّف ومتصل
- ❌ Firestore API غير مفعل
- ✅ النظام يعمل بـ MemStorage مؤقتاً
- ✅ جميع بيانات المعلمين متوفرة محلياً

## 🚀 بعد التفعيل:
ستحصل على:
- قاعدة بيانات سحابية دائمة
- مزامنة فورية
- نسخ احتياطية تلقائية
- إمكانية الوصول من أي مكان

---
**ملاحظة:** إذا كنت تريد الاستمرار بقاعدة البيانات المحلية، فالنظام يعمل بشكل طبيعي الآن!