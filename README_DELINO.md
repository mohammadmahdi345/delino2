
# Delino — سامانهٔ سفارش آنلاین رستوران‌ها

> **Delino** — سیستم سفارش آنلاین غذا که امکان اضافه کردن چندین رستوران با منوهای مجزا و سفارش اینترنتی را فراهم می‌آورد.  
> Backend با Django + DRF و Frontend با React پیاده‌سازی شده است. از Docker برای راحتی توسعه و استقرار استفاده می‌شود.

---

## 📌 فهرست محتوا
- ویژگی‌ها
- معماری و فناوری‌ها
- پیش‌نیازها
- نصب و اجرا (محیط توسعه با Docker)
- اجرای محلی بدون Docker
- متغیرهای محیطی (`.env`)
- مستندات API
- ساختار پروژه
- تست‌ها و بررسی عملکرد
- امنیت و نکات تولید (production)
- دیپلوی پیشنهادشده
- مشارکت (Contributing)
- لینک و تماس
- مجوز (License)

---

## ✨ ویژگی‌ها (Highlights)
- اضافه کردن/مدیریت چندین رستوران (نام، توضیح، آدرس، تلفن و …)
- هر رستوران منوی جداگانه با آیتم‌های منو (نام، قیمت، توضیح، تصویر)
- سفارش آنلاین: افزودن به سبد خرید، ثبت سفارش، مشاهده وضعیت سفارش
- احراز هویت و مجوزها (Django auth & token / OAuth2 قابل فعال‌سازی)
- پنل مدیریت Django Admin برای مدیریت رستوران‌ها، منوها و سفارش‌ها
- مستندات API با Swagger / Redoc
- صف‌های پس‌زمینه و نوتیفیکیشن با Celery + Redis (برای ایمیل/نوتیف)
- تست‌های واحد و integration با pytest
- آماده برای دیپلوی با Docker و docker-compose

---

## 🧰 فناوری‌ها (Tech Stack)
- Backend: Python, Django, Django REST Framework
- Frontend: React (CRA یا Vite)
- Queue: Celery + Redis
- Database: MySQL (یا PostgreSQL به‌دلخواه)
- Cache & Session: Redis
- Containerization: Docker, docker-compose
- Docs: drf-yasg / drf-spectacular / Swagger UI
- Testing: pytest, pytest-django, Locust (برای load testing)

---

## ▶️ پیش‌نیازها (Local)
- Git
- Docker & Docker Compose (توصیه‌شده)
- (در صورت اجرای محلی بدون Docker) Python 3.8+، Node.js و MySQL

---

## ⚙️ نصب و اجرا با Docker (توصیه‌شده)
> این بخش فرض می‌کند دایرکتوری پروژه را کلون کرده‌ای.

```bash
# کلون کردن
git clone https://github.com/your-username/delino.git
cd delino

# کپی فایل نمونهٔ env و تنظیم متغیرها
cp .env.example .env
# سپس .env را ویرایش کن و مقادیر DB, SECRET_KEY, ALLOWED_HOSTS و ... را وارد کن

# اجرای کانتینرها (backend, db, redis, celery, frontend, nginx)
docker-compose up -d --build

# اجرای مایگریشن‌ها داخل کانتینر وب
docker-compose exec web python manage.py migrate

# ساخت سوپریوزر برای ورود به Dockerized Admin
docker-compose exec web python manage.py createsuperuser

# جمع‌آوری استاتیک (Production)
docker-compose exec web python manage.py collectstatic --noinput
```

بعد از بالا آمدن کانتینرها:
- Frontend معمولاً روی `http://localhost:3000` یا `http://localhost:8000` (بسته به تنظیمات) در دسترس است.
- Backend API روی `http://localhost:8000/api/` قرار دارد.
- Swagger: `http://localhost:8000/api/docs/` (بسته به تنظیمات).

---

## 🧩 متغیرهای محیطی نمونه (`.env.example`)
```env
# Django
DJANGO_SECRET_KEY=replace_me_with_strong_key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (MySQL example)
DB_ENGINE=django.db.backends.mysql
DB_NAME=delino_db
DB_USER=delino_user
DB_PASSWORD=changeme
DB_HOST=db
DB_PORT=3306

# Redis / Celery
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=${REDIS_URL}

# Email (SMTP) - برای نوتیف‌ها
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=supersecret

# OAuth2 / Social (optional)
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
```

---

## 🔍 مستندات API
مستندات تعاملی API (Swagger/Redoc) پس از راه‌اندازی در مسیر مشخص‌شده قابل‌دسترس است، معمولاً:
```
http://localhost:8000/api/docs/
```
در مستندات، endpointهای کلیدی مانند:
- `GET /api/restaurants/` — لیست رستوران‌ها
- `POST /api/restaurants/` — ایجاد رستوران (admin)
- `GET /api/restaurants/{id}/` — جزئیات رستوران + منوها
- `GET /api/menus/` — لیست منوها یا آیتم‌ها
- `POST /api/orders/` — ثبت سفارش
- `GET /api/orders/{id}/` — وضعیت سفارش
- `POST /api/auth/token/` — احراز هویت (یا `/oauth/token/` اگر OAuth2)

> مسیرها بسته به پیاده‌سازی پروژه‌ات ممکن است کمی متفاوت باشند — از Swagger برای دیدن دقیق استفاده کن.

---

## 🗂 ساختار پیشنهادی پروژه (نمونه)
```
delino/
├─ backend/
│  ├─ delino/                # Django project
│  ├─ apps/
│  │  ├─ restaurants/        # models: Restaurant, MenuItem, Category
│  │  ├─ orders/             # models: Order, OrderItem, Payment
│  │  ├─ users/              # auth, profiles
│  │  └─ notifications/      # emails + celery tasks
│  ├─ requirements.txt
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ services/           # axios api client
│  └─ package.json
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

---

## ✅ مدل‌های داده (نمونه)
- `Restaurant` (name, description, address, phone, is_active, owner)
- `MenuItem` (restaurant FK, name, description, price, image, category)
- `Order` (user FK, total_price, status, created_at)
- `OrderItem` (order FK, menu_item FK, quantity, price)
- `Review` (user FK, restaurant/menu_item FK, rating, comment)

---

## 🧪 تست و بررسی عملکرد
- اجرای تست‌ها (داخل کانتینر):
```bash
docker-compose exec web pytest
```
- تست بار/لود با Locust:
```bash
# لوکاست را نصب و فایل locustfile.py را تنظیم کن
locust -f locustfile.py
# سپس UI لوکاست روی http://localhost:8089
```

---

## 🔐 نکات امنیتی برای Production
- `DEBUG = False`
- مقداردهی `SECRET_KEY` قوی و ذخیره‌شده در env
- تنظیم `ALLOWED_HOSTS` به دامنه‌های مجاز
- فعال‌سازی HTTPS (NGINX + Certbot) و `SECURE_SSL_REDIRECT=True`
- فعال کردن CSRF protection و HttpOnly cookies
- محدود کردن CORS فقط به دامنهٔ فرانت‌اند
- rate limiting یا راهکارهایی مثل `django-axes` برای جلوگیری از brute-force
- بررسی و محدودیت سایز و MIME فایل‌های آپلودی
- لاگینگ و مانیتورینگ (Sentry یا مشابه)

---

## 🚀 راهنمای دیپلوی (خلاصه)
1. ساخت Docker image برای backend و frontend
2. اجرای docker-compose با تنظیمات production (Gunicorn + Nginx + Certbot)
3. اجرای Migrations و `collectstatic`
4. راه‌اندازی Celery worker و Beat در پس‌زمینه
5. بررسی Health-check و مانیتورینگ

---

## ♻️ توسعه و مشارکت (Contributing)
- Fork کن و branch جدید بساز (`feature/xxx`)
- تغییرات را با تست‌های واحد همراه کن
- PR بفرست با توضیحِ تغییرات و تست‌ها
- قبل از merge، CI باید همه تست‌ها را پاس کند

---

## 📬 تماس و اطلاعات بیشتر
- مخزن: `https://github.com/your-username/delino`  
- ایمیل نگهدارنده: your.email@example.com

---

## 📜 License
این پروژه تحت مجوز MIT قرار می‌گیرد — در صورت نیاز فایل `LICENSE` را اضافه کن.
