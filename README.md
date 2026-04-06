# IIT (ISM) Dhanbad — CDC Portal

A full-stack web portal for the **Career Development Centre, IIT (ISM) Dhanbad** that enables companies to register and submit Job Notification Forms (JNF) and Internship Notification Forms (INF) for campus placements.

---

## 📁 Project Structure

```
iitism-cdc-portal/
├── iitism-cdc-frontend/    # Next.js 15 frontend (TypeScript, MUI v6.5)
├── iitism-cdc-api/         # Laravel 11 backend (PHP 8.2, MySQL)
└── antigravity/            # Project documentation & prompts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, MUI v6.5, NextAuth v5 |
| Backend | Laravel 11, PHP 8.2, MySQL |
| Auth | Laravel Sanctum (API tokens) |
| Queue | Laravel Database Queue |
| Email | Mailtrap (dev), SMTP (prod) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PHP 8.2+ (via XAMPP)
- Composer
- MySQL (via XAMPP)

### Frontend
```bash
cd iitism-cdc-frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL and NEXTAUTH_SECRET
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd iitism-cdc-api
composer install
cp .env.example .env
php artisan key:generate
# Configure DB in .env (DB_DATABASE=iitism_cdc)
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
# → http://localhost:8000/api/health
```

---

## 🔑 Default Credentials (Dev Only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@iitism.ac.in | Admin@IITISM#2024 |
| Test Company | hr@testcompany.com | Company@123 |

---

## 📋 Features (In Progress)

- [x] Company registration with OTP email verification
- [x] Sanctum token authentication (role-based: admin / company)
- [x] Email notification system (OTP, Welcome, Admin alerts)
- [ ] JNF / INF multi-step form with auto-save
- [ ] Admin review panel
- [ ] PDF generation
- [ ] Full dashboard (company + admin)
