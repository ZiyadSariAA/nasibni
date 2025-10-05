# إعداد Firebase للتطبيق

## خطوات إعداد Firebase:

### 1. إنشاء مشروع Firebase:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط "Add project"
3. أدخل اسم المشروع: `nasibni-app`
4. فعّل Google Analytics (اختياري)

### 2. إضافة تطبيق ويب:
1. في Firebase Console، اضغط على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `nasibni-web`
3. انسخ إعدادات Firebase

### 3. إنشاء ملف .env:
أنشئ ملف `.env` في المجلد الرئيسي وأضف:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 4. تفعيل Authentication:
1. في Firebase Console، اذهب إلى "Authentication"
2. اضغط "Get started"
3. اذهب إلى "Sign-in method"
4. فعّل "Email/Password"

### 5. إعداد Firestore:
1. اذهب إلى "Firestore Database"
2. اضغط "Create database"
3. اختر "Start in test mode" (للاختبار)
4. اختر موقع الخادم الأقرب

### 6. اختبار التطبيق:
بعد إعداد Firebase، يمكنك:
- إنشاء حساب جديد
- تسجيل الدخول
- إعادة تعيين كلمة المرور

## ملاحظات مهمة:
- تأكد من أن ملف `.env` في `.gitignore`
- لا تشارك مفاتيح Firebase مع أحد
- استخدم قواعد أمان Firestore في الإنتاج
