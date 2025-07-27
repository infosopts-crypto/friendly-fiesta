# تعليمات تفعيل Firebase Firestore

## الخطوات لتفعيل Firestore:

### 1. زيارة وحدة التحكم في Firebase
اذهب إلى: [Firebase Console](https://console.firebase.google.com/)

### 2. اختيار المشروع
- اختر مشروع `rwesh-98a7b`

### 3. تفعيل Firestore Database
1. من القائمة الجانبية، اختر **"Firestore Database"**
2. انقر على **"Create database"**
3. اختر **"Start in test mode"** للآن (يمكن تغيير القواعد لاحقاً)
4. اختر موقع الخادم (يفضل أقرب منطقة جغرافياً)
5. انقر **"Done"**

### 4. أو تفعيل من خلال الرابط المباشر
زيارة هذا الرابط لتفعيل Firestore API:
```
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=rwesh-98a7b
```

### 5. بعد التفعيل
في ملف `server/storage.ts`، غيّر السطر التالي:
```typescript
// من:
export const storage = new MemStorage();

// إلى:
export const storage = new FirebaseStorage();
```

### 6. إعادة تشغيل الخادم
```bash
npm run dev
```

## ملاحظات:
- بعد تفعيل Firestore، قم بتشغيل script النقل لإضافة المعلمين:
```bash
npx tsx scripts/migrate-to-firebase.ts
```

- سيتم حفظ جميع البيانات في Firebase تلقائياً
- لن تحتاج لإعادة إدخال بيانات المعلمين