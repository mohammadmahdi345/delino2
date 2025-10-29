
# Delino — سامانهٔ سفارش آنلاین رستوران‌ها

> **Delino** — سیستم سفارش آنلاین غذا که امکان اضافه کردن چندین رستوران با منوهای مجزا و سفارش اینترنتی را فراهم می‌آورد.  
> Backend با Django + DRF و Frontend با React پیاده‌سازی شده است. از Docker برای راحتی توسعه و استقرار استفاده می‌شود.
>
> لینک یوتیوب برای دیدن تمامی قسمت های سایت: https://youtu.be/o7_NcqvPNYI?feature=shared

---

## 📌 فهرست محتوا
- ویژگی‌ها
- معماری و فناوری‌ها
- پیش‌نیازها
- نصب و اجرا (محیط توسعه با Docker)
- اجرای محلی بدون Docker


---

## ✨ ویژگی‌ها (Highlights)
- اضافه کردن/مدیریت چندین رستوران (نام، توضیح، آدرس، تلفن و …)
- هر رستوران منوی جداگانه با آیتم‌های منو (نام، قیمت، توضیح، تصویر)
- سفارش آنلاین: افزودن غذا به سبد خرید، ثبت سفارش، مشاهده وضعیت سفارش و پرداخت
- احراز هویت با jwt سفارشی و با شماره تلفن و رمز عبور
- پنل مدیریت Django Admin برای مدیریت رستوران‌ها، منوها و سفارش‌ها
- آماده برای دیپلوی با Docker و docker-compose

---

## 🧰 فناوری‌ها (Tech Stack)
- Backend: Python, Django, Django REST Framework
- Frontend: React 
- Database: MySQL
- Containerization: Docker, docker-compose
---

## ▶️ پیش‌نیازها (Local)
- Git
- Docker & Docker Compose

---

## ⚙️ نصب و اجرا با Docker 


```bash
# کلون کردن
git clone https://github.com/mohammadmahdi345/delino2.git
cd delino


# اجرای کانتینرها (backend, db, frontend )
docker-compose up -d --build

# اجرای مایگریشن‌ها داخل کانتینر وب
docker-compose exec web python manage.py migrate

# ساخت سوپریوزر برای ورود به Dockerized Admin
docker-compose exec web python manage.py createsuperuser


بعد از بالا آمدن کانتینرها:
- Frontend معمولاً روی `http://localhost:3001` یا `http://localhost:8004` (بسته به تنظیمات) در دسترس است.

---

