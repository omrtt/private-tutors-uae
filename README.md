# خصوصي - منصة المدرسين الخصوصيين في الإمارات

تطبيق ويب متكامل لربط الطلاب بالمدرسين الخصوصيين في الإمارات، مع دعم كامل للغة العربية وواجهة مستخدم عصرية.

## الميزات

- 🔍 **البحث عن مدرّس**: فلترة حسب المادة، الإمارة، السعر، والتقييم
- 📅 **حجز الحصص**: نظام حجز متكامل مع تقويم المواعيد
- 💳 **الدفع**: دعم الدفع ببطاقة الائتمان والتحويل البنكي
- ⭐ **التقييمات**: تقييم المدرسين بعد الحجز
- 💬 **المحادثات**: تواصل مباشر بين الطالب والمدرّس
- 🔔 **الإشعارات**: إشعارات فورية للمستخدمين
- 👨‍💼 **لوحة الإدارة**: تحكم كامل بجميع أجزاء المنصة
- 📊 **تقارير ورسوم بيانية**: إحصائيات المبيعات والأداء
- 🏷️ **كوبونات خصم**: نظام أكواد خصم للحجوزات
- 📥 **تصدير البيانات**: CSV للمستخدمين والحجوزات والمدفوعات

## التقنيات المستخدمة

- **Frontend**: React + Vite + Tailwind CSS + Recharts + Framer Motion
- **Backend**: Node.js + Express + Mongoose
- **قاعدة البيانات**: MongoDB
- **PWA**: دعم التثبيت كتطبيق هاتف مع Service Worker

## متطلبات التشغيل

- Node.js 18+
- MongoDB 7+ (أو MongoDB Atlas)
- PM2 (لإدارة العملية في الإنتاج)

## التثبيت والتشغيل (تطوير)

### 1. تشغيل MongoDB محلياً

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# أو عبر Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 2. إعداد البيئة

```bash
cd backend
cp .env.example .env
# عدّل .env بإعداداتك
```

### 3. تشغيل التطبيق

```bash
# Backend
cd backend
npm install
npm run dev     # مع auto-reload

# Frontend (نافذة طرفية أخرى)
cd frontend
npm install
npm run dev     # يعمل على port 3000
```

### 4. تعبئة قاعدة البيانات

التطبيق يقرأ ملفات JSON من `backend/data/` ويستوردها تلقائياً عند أول تشغيل (القاعدة فاضية).

معلومات تسجيل الدخول المبدئية:
- **مشرف**: admin@test.com / 123456
- **مدرّس**: tutorelite@test.com / 123456
- **طالب**: student@test.com / 123456

---

## النشر على VPS

### 1. متطلبات السيرفر

```bash
# تحديث الحزم
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable mongod && sudo systemctl start mongod

# تثبيت PM2
sudo npm install -g pm2

# تثبيت Nginx
sudo apt install -y nginx
```

### 2. تجهيز مجلد السجلات

```bash
sudo mkdir -p /var/log/private-tutors
sudo chown -R $USER:$USER /var/log/private-tutors
```

### 3. Clone ونشر

```bash
git clone <رابط-المستودع> /opt/private-tutors-uae
cd /opt/private-tutors-uae
bash deploy.sh
```

### 4. إعداد Nginx (عكس الوكيل)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

### 5. شهادة SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. إدارة التطبيق

```bash
pm2 status                      # عرض الحالة
pm2 logs private-tutors-uae     # مشاهدة السجلات
pm2 restart private-tutors-uae  # إعادة تشغيل
pm2 stop private-tutors-uae     # إيقاف
pm2 startup                     # تشغيل تلقائي عند إقلاع السيرفر
```

---

## إعداد MongoDB Atlas (قاعدة بيانات سحابية)

1. أنشئ حساب مجاني على https://www.mongodb.com/atlas
2. اختر免费 cluster (M0)
3. أضف IP (`0.0.0.0/0` للسماح للكل)
4. أنشئ مستخدم قاعدة بيانات
5. خذ رابط الاتصال (`mongodb+srv://...`) وضعه في `MONGO_URI` في `.env`

## كلمة أخيرة

بعد النشر، سجل الدخول بالمشرف (`admin@test.com / 123456`) وافعل المستخدمين والموافقات من لوحة الإدارة.
