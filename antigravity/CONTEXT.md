# IIT (ISM) Dhanbad — CDC Portal
## Antigravity Context File — Updated 2026-04-06
### Paste this at the top of EVERY new prompt session

---

## 1. Project Identity

**Project Name:** IIT (ISM) Dhanbad — Career Development Centre (CDC) Portal  
**Purpose:** A web portal where companies register and fill Job Notification Forms (JNF) or Intern Notification Forms (INF) to participate in campus placements/internships. The CDC admin team reviews, approves or rejects these submissions.  
**Institute:** Indian Institute of Technology (Indian School of Mines), Dhanbad, Jharkhand — one of India's oldest and most prestigious technical institutes (est. 1926, 99+ years).  
**CDC Full Name:** Career Development Centre, IIT (ISM) Dhanbad  
**Project root:** `c:\DBMS_PROJECT`

---

## 2. Tech Stack — STRICTLY ENFORCED

### Frontend (`c:\DBMS_PROJECT\iitism-cdc-frontend`)
- **Next.js 15** (App Router, TypeScript, `.tsx` files only — no `.js` or `.jsx` ever)
- **MUI v6.5** (`@mui/material` pinned to `"6.5"`, `@mui/material-nextjs` `"6.5"`)
- **NextAuth.js v5** (`next-auth@^5.0.0-beta.30`) for session management
- **react-hook-form** `^7.72.1` (for all form state — never `useState` for forms)
- **axios** `^1.14.0` (all API calls via `src/lib/api.ts`)
- **react-hot-toast** `^2.6.0` (notifications/toasts)
- **@mui/x-date-pickers** `^8.27.2` + **dayjs** `^1.11.20` (date fields)
- **@hookform/resolvers** `^5.2.2` + **zod** `^4.3.6` (form validation)
- **react-quill** `^2.0.0` (rich text editor for JD fields)
- **@mui/icons-material** `^7.3.9`

### Backend (`c:\DBMS_PROJECT\iitism-cdc-api`)
- **Laravel 11** (PHP 8.2 via XAMPP)
- **MySQL / MariaDB** (via XAMPP, DB name: `iitism_cdc`, managed with HeidiSQL)
- **Laravel Sanctum** (API token auth, `personal_access_tokens` table)
- **Queue:** `database` driver (jobs table exists)
- **Mail:** SMTP via Mailtrap sandbox (`sandbox.smtp.mailtrap.io:2525`)
- **barryvdh/laravel-dompdf** (PDF generation — not yet implemented)

### URLs
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`
- NEXT_PUBLIC_API_URL=`http://localhost:8000/api`

### Absolute Rules
- ALL frontend files must be `.tsx` — TypeScript + JSX only
- No plain `.js` or `.jsx` files anywhere in the Next.js project
- No Tailwind CSS, no Bootstrap, no custom CSS files — only MUI `sx` prop and MUI `styled()`
- No class components — only functional components with hooks
- All API calls go through the centralized `src/lib/api.ts` axios instance
- All types/interfaces go in `src/types/index.ts`
- Never use `any` TypeScript type — define proper interfaces
- Never hardcode API URLs — always use `process.env.NEXT_PUBLIC_API_URL`

---

## 3. Current Progress — What Has Been Done ✅

### Phase 1: Foundation — COMPLETE ✅

**Backend (Laravel) — All migrations run, all models created:**

| Table | Status |
|-------|--------|
| `users` | ✅ Created |
| `companies` | ✅ Created |
| `company_contacts` | ✅ Created |
| `job_notification_forms` | ✅ Created |
| `jnf_eligibility` | ✅ Created |
| `jnf_job_profiles` | ✅ Created |
| `jnf_salary` | ✅ Created |
| `jnf_selection_process` | ✅ Created |
| `jnf_declaration` | ✅ Created |
| `notifications` | ✅ Created |
| `form_audit_log` | ✅ Created |
| `otp_verifications` | ✅ Created |
| `personal_access_tokens` | ✅ Created (Sanctum) |
| `cache` | ✅ Created |
| `jobs` (queue) | ✅ Created |

**Models created and confirmed:**
- `User.php` — role (`company`/`admin`), `is_active`, `email_verified_at`
- `Company.php` — all profile fields, `belongsTo(User)`, `hasMany(CompanyContact)`, `hasMany(JobNotificationForm)`
- `CompanyContact.php`
- `JobNotificationForm.php` — all relationships (`jobProfile`, `eligibility`, `salary`, `selectionProcess`, `declaration`, `auditLogs`)
- `JnfJobProfile.php`
- `JnfEligibility.php`
- `JnfSalary.php`
- `JnfSelectionProcess.php`
- `JnfDeclaration.php`
- `FormAuditLog.php`
- `Notification.php`

**Frontend (Next.js) — Foundation:**
- Project at `c:\DBMS_PROJECT\iitism-cdc-frontend` using App Router
- `src/theme/theme.ts` — MUI theme: primary `#1a237e` (navy), secondary `#b71c1c` (red), Inter font
- `src/lib/api.ts` — Axios instance with Bearer token interceptor + 401 signOut
- `src/lib/constants.ts` — DEPARTMENTS, BRANCHES, COURSES, ORG_TYPES, SECTORS, etc.
- `src/components/Providers.tsx` — SessionProvider + ThemeProvider + Toaster wrapper
- `src/app/layout.tsx` — AppRouterCacheProvider + Providers
- `src/middleware.ts` — Route protection (admin/company roles, redirect to /login)

### Phase 2: Authentication & Registration — COMPLETE ✅

**Backend — AuthController (`app/Http/Controllers/Api/AuthController.php`):**
- `sendOtp()` — validates email, prevents duplicate, generates 6-digit OTP, queues `OtpEmail`, stores in `otp_verifications`
- `verifyOtp()` — validates OTP + expiry (5 min), marks `is_used=true`
- `register()` — validates all fields, creates `User` + `Company` + `CompanyContact` in DB transaction, queues `WelcomeEmail`, fires `CompanyRegistered` event
- `login()` — Sanctum token with abilities `['role:admin']` or `['role:company']`
- `logout()` — deletes current token
- `me()` — returns user with company

**Backend — Events & Listeners:**
- `app/Events/CompanyRegistered.php` — holds `$company`
- `app/Listeners/SendAdminNewCompanyAlert.php` — sends `AdminNewCompanyAlert` to `admin@iitism.ac.in`, creates DB notification

**Backend — Mail classes:**
- `app/Mail/OtpEmail.php` → `resources/views/emails/otp.blade.php`
- `app/Mail/WelcomeEmail.php` → `resources/views/emails/welcome.blade.php`
- `app/Mail/AdminNewCompanyEmail.php` → `resources/views/emails/admin_new_company.blade.php`

**Backend — Routes (`routes/api.php`):**
```
GET  /api/health
POST /api/auth/send-otp   (rate limited: 5/min)
POST /api/auth/verify-otp
POST /api/auth/register
POST /api/auth/login
GET  /api/user            (auth:sanctum)
POST /api/auth/logout     (auth:sanctum)
GET  /api/auth/me         (auth:sanctum)
```

**Frontend — Registration wizard (`/register`):**
- `src/app/(auth)/register/page.tsx` — 3-step wizard with MUI Stepper
- `src/components/forms/shared/EmailVerificationStep.tsx` — Send OTP + countdown timer (5 min) + resend + verify
- `src/components/forms/shared/RecruiterDetailsStep.tsx` — full_name, designation, mobile (+91 prefix), password (strength meter) + confirm
- `src/components/forms/shared/CompanyProfileStep.tsx` — company_name, org_type (with HQ country/city if MNC), website, sector, nature_of_business, postal_address, date_of_establishment (DatePicker), annual_turnover, no_of_employees, industry_tags (chip input), social_media_url, description, logo upload (2MB max, preview)

**Frontend — Auth:**
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth CredentialsProvider calling `POST /api/auth/login`, JWT + session callbacks storing `role`, `accessToken`, `id`
- `src/app/(auth)/login/page.tsx` — **stub only** (placeholder card, no actual form yet — NEEDS full implementation)

**Frontend — Company Dashboard:**
- `src/app/(company)/dashboard/page.tsx` — **stub only** (static cards with zeros — needs real API integration)

### Known Issues / Incomplete Items in Phase 2:
1. **Login page (`/login`)** — only a stub. Needs: full split-panel UI, react-hook-form, signIn(), role-based redirect
2. **Forgot password** — backend methods not yet added to AuthController; frontend pages not created
3. **Dashboard** — static zeros, needs `GET /api/company/dashboard` endpoint + real data
4. **NextAuth NEXTAUTH_SECRET** — must be set in `.env.local`; currently using `next-auth@beta` which may have config differences

---

## 4. What Has NOT Been Done Yet ❌ (Pending)

### Phase 2 — Remaining Items (Prompts 14-16):
- [ ] **Prompt 14:** Full login page UI (split panel, react-hook-form, NextAuth signIn, role redirect)
- [ ] **Prompt 15:** Forgot password + reset password (backend API + frontend pages)
- [ ] **Prompt 16:** Company dashboard with real API data (stats, recent submissions, sidebar nav)

### Phase 3 — JNF/INF Form (Prompts 17–24) — NOT STARTED:
- [ ] **Prompt 17:** JNF form shell + stepper + auto-save architecture (`/jnf/new` page, `JnfFormShell.tsx`)
- [ ] **Prompt 18:** JNF Section 1 (Company Profile read-only) + Section 2 (Contact & HR Details)
- [ ] **Prompt 19:** JNF Section 3 (Job Profile) — title, designation, posting, skills, JD (react-quill), bond, PPO
- [ ] **Prompt 20:** JNF Section 4 (Eligibility & Courses) — programme+branch grouped checkboxes, CGPA, backlogs
- [ ] **Prompt 21:** JNF Section 5 (Salary Details) — CTC grid per programme, currency toggle, bonus fields
- [ ] **Prompt 22:** JNF Section 6 (Selection Process) — stages, modes, types, durations, infrastructure
- [ ] **Prompt 23:** JNF Section 7 (Declaration & Submit) — AIPC checkboxes, signatory, preview, submit
- [ ] **Prompt 24:** INF form (same as JNF but Section 5 = Stipend Details)
- [ ] **Backend JNF/INF controllers** — `JnfController` (create, show, saveDraft, submit, list)

### Phase 4 — Admin Panel (Prompts 25–32) — NOT STARTED:
- Admin page stubs exist in `src/app/(admin)/admin/` for: dashboard, companies, submissions, settings, notifications
- [ ] **Prompt 25:** Admin layout + dashboard (sidebar nav, stats overview)
- [ ] **Prompt 26:** Companies list (search, filter, approve/suspend)
- [ ] **Prompt 27:** Submissions list (all JNFs/INFs, filter by status, season)
- [ ] **Prompt 28:** Form review page (full view, approve/reject/request changes with email)
- [ ] **Prompt 29:** Email templates for admin actions + notification service
- [ ] **Prompt 30:** Admin notifications page + settings
- [ ] **Prompt 31:** Resubmission flow + admin field editing with audit log
- [ ] **Prompt 32:** PDF generation (barryvdh/laravel-dompdf) + version history

### Phase 5 — Polish (Prompts 33–40) — NOT STARTED:
- Public landing page, profile edit & completion guard, auto-save UX, mobile responsive, rate limiting, API Resources, seed data, .env files, SETUP.md

### Phase 6 — Final (Prompts 41–48) — NOT STARTED:
- Postman collection, TypeScript strict mode audit, company search/filter, form preview modal, notifications timeline, admin reporting, E2E test journey, cleanup + docs

---

## 5. Database Schema Summary

### `users`
| Field | Type | Notes |
|-------|------|-------|
| id | bigint PK | |
| name | varchar | |
| email | varchar unique | |
| password | varchar | bcrypt |
| role | enum | `company`, `admin` |
| is_active | boolean | default true |
| email_verified_at | timestamp nullable | |
| remember_token | varchar nullable | |
| timestamps | | |

### `companies`
| Field | Type | Notes |
|-------|------|-------|
| id | bigint PK | |
| user_id | FK → users | cascadeOnDelete |
| company_name | varchar(255) | |
| website | varchar(500) nullable | |
| sector | varchar(255) | |
| org_type | enum | PSU, MNC, Startup, NGO, Private, Government, Other |
| nature_of_business | text nullable | |
| date_of_establishment | date nullable | |
| annual_turnover | varchar nullable | (NIRF field) |
| no_of_employees | varchar nullable | |
| hq_country | varchar nullable | |
| hq_city | varchar nullable | |
| industry_tags | json nullable | |
| social_media_url | varchar nullable | |
| description | text nullable | |
| logo_path | varchar nullable | |
| postal_address | text nullable | |
| is_profile_complete | boolean | default false |
| timestamps | | |

### `company_contacts`
| Field | Type | Notes |
|-------|------|-------|
| id | bigint PK | |
| company_id | FK → companies | |
| contact_type | enum | `head_hr`, `poc_1`, `poc_2` |
| full_name, designation, email, mobile, alt_mobile, landline | varchar | |

### `job_notification_forms`
| Field | Type | Notes |
|-------|------|-------|
| id | bigint PK | |
| company_id | FK → companies | |
| season | varchar | e.g. `2025-26` |
| form_type | enum | `JNF`, `INF` |
| status | enum | `draft`, `submitted`, `under_review`, `approved`, `rejected` default `draft` |
| submitted_at, reviewed_at | timestamp nullable | |
| reviewed_by | FK → users nullable | |
| review_comments, admin_notes, rejection_reason | text nullable | |
| version | int | default 1 |
| parent_form_id | FK self-ref nullable | for resubmissions |

### `jnf_eligibility`
- `jnf_id`, `programmes` (json), `min_cgpa` (decimal), `backlogs_allowed` (bool), `highschool_percent` (decimal), `gender_filter` (enum: all/male/female/other), `per_discipline_cgpa` (json nullable), `special_requirements` (text)

### `jnf_job_profiles`
- `jnf_id`, `profile_name`, `designation`, `place_of_posting`, `work_mode` (onsite/remote/hybrid), `tentative_joining` (date), `expected_hires` (int), `min_hires` (int), `skills` (json), `job_description` (longtext), `jd_pdf_path`, `ppo_provision` (bool), `registration_link`, `bond_details`, `onboarding_procedure`, `additional_info`

### `jnf_salary`
- `jnf_id`, `currency`, `same_for_all` (bool), `salary_data` (json), `joining_bonus`, `retention_bonus`, `variable_bonus`, `esops`, `relocation_allowance`, `medical_allowance`, `deductions`, `bond_amount`, `bond_duration`, `first_year_ctc`, `gross_salary`, `ctc_breakup`, `custom_components` (json)

### `jnf_selection_process`
- `jnf_id`, `stages` (json), `selection_mode` (enum: online/offline/hybrid), `shortlisting_criteria`, `requires_laptop` (bool), `requires_personal_interview_room` (bool), `additional_infrastructure`, `expected_duration`

### `jnf_declaration`
- `jnf_id`, `aipc_agreed`, `shortlisting_agreed`, `info_verified`, `ranking_consent`, `accuracy_confirmed`, `rti_nirf_consent` (all bool), `signatory_name`, `signatory_designation`, `signatory_date`, `typed_signature`

### `otp_verifications`
- `id`, `email`, `otp`, `expires_at`, `is_used`, `created_at`

---

## 6. Seeded Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@iitism.ac.in` | `Admin@IITISM#2024` |
| Company (test) | `hr@testcompany.com` | `Company@123` |

---

## 7. JNF Form — 7 Sections

1. **Company Profile** — pre-filled from registration, read-only with edit option + season selector
2. **Contact & HR Details** — Head HR + PoC 1 (required) + PoC 2 (optional, collapsible)
3. **Job Profile** — title, designation, posting, work mode, hires, skills chips, react-quill JD or PDF upload, bond, PPO switch
4. **Eligibility & Courses** — programme+branch grouped checkboxes (MUI Accordion), CGPA, backlogs, gender filter
5. **Salary Details** — CTC grid per programme, currency toggle (INR/USD/EUR), joining bonus, ESOPs etc.
6. **Selection Process** — stages (add/remove), online/offline/hybrid, infrastructure needs
7. **Declaration & Submit** — 6 AIPC checkboxes, signatory name/designation/date/signature, preview, final submit

## 8. INF Form — Same as JNF except:
- Section 5 = **Stipend Details** (monthly stipend, HRA, variable pay — not CTC)

---

## 9. User Roles

| Role | Access |
|------|--------|
| `company` | Register, login, fill JNF/INF, view own submissions, track status |
| `admin` | View all companies, all JNF/INF submissions, approve/reject/edit, notifications, settings |

---

## 10. Key Business Rules

1. Company registers with OTP on company email → auto-receives login credentials by email
2. Admin (`admin@iitism.ac.in`) gets email notification on every new company registration
3. Company fills JNF/INF → auto-saves every 30 seconds (draft state)
4. On submission → company gets confirmation email, admin gets notification
5. Admin can: Approve / Reject with reason / Request Changes (all trigger emails)
6. Company can revise and resubmit a rejected form (new version, `parent_form_id` set)
7. Admin can edit any field in any submitted form (all edits logged in `form_audit_log`)
8. All form submissions generate downloadable PDFs with IIT ISM letterhead

---

## 11. Design System

- **Primary color:** `#1a237e` (IIT ISM dark navy blue)
- **Secondary color:** `#b71c1c` (deep red — IIT ISM accent)
- **Background:** `#f5f5f5` (light grey page bg)
- **Card bg:** `#ffffff`
- **Font:** Inter (via MUI theme, loaded from Google Fonts in layout.tsx)
- **Status colors:** Draft=grey, Submitted=blue(`#1565c0`), Under Review=amber(`#f57c00`), Approved=green(`#2e7d32`), Rejected=red(`#c62828`)
- **Border radius:** 8px buttons, 12px cards
- **All pages must be fully responsive** (mobile 375px → desktop 1440px)
- MUI Button: `borderRadius: 8px, textTransform: 'none', fontWeight: 600`

---

## 12. File Structure (Current State)

```
c:\DBMS_PROJECT\
├── iitism-cdc-frontend\
│   └── src\
│       ├── app\
│       │   ├── (auth)\
│       │   │   ├── login\page.tsx          ← STUB — needs full login UI
│       │   │   └── register\page.tsx       ✅ 3-step wizard shell
│       │   ├── (company)\
│       │   │   ├── dashboard\page.tsx      ← STUB — static zeros
│       │   │   ├── jnf\
│       │   │   │   ├── new\page.tsx        ← STUB — placeholder text
│       │   │   │   └── [id]\              ← empty
│       │   │   └── inf\                   ← empty
│       │   ├── (admin)\
│       │   │   └── admin\
│       │   │       ├── companies\         ← STUB
│       │   │       ├── dashboard\         ← STUB
│       │   │       ├── notifications\     ← STUB
│       │   │       ├── settings\          ← STUB
│       │   │       └── submissions\       ← STUB
│       │   ├── (public)\                  ← empty
│       │   ├── api\auth\[...nextauth]\route.ts  ✅ NextAuth configured
│       │   ├── layout.tsx                 ✅ AppRouterCacheProvider + Providers
│       │   └── page.tsx                   (landing page stub)
│       ├── components\
│       │   ├── Providers.tsx              ✅ SessionProvider + ThemeProvider + Toaster
│       │   ├── forms\
│       │   │   ├── shared\
│       │   │   │   ├── EmailVerificationStep.tsx    ✅
│       │   │   │   ├── RecruiterDetailsStep.tsx     ✅
│       │   │   │   └── CompanyProfileStep.tsx       ✅
│       │   │   ├── jnf\index.ts           ← empty placeholder
│       │   │   └── inf\index.ts           ← empty placeholder
│       │   ├── layout\index.ts            ← empty
│       │   ├── ui\                        ← empty
│       │   └── admin\                     ← empty
│       ├── lib\
│       │   ├── api.ts                     ✅ Axios instance
│       │   └── constants.ts               ✅ DEPARTMENTS, BRANCHES, COURSES, etc.
│       ├── theme\theme.ts                 ✅ MUI theme config
│       ├── types\                         ← needs population
│       └── middleware.ts                  ✅ Route protection
│
└── iitism-cdc-api\
    ├── app\
    │   ├── Http\Controllers\Api\
    │   │   └── AuthController.php         ✅ login, logout, me, sendOtp, verifyOtp, register
    │   ├── Events\CompanyRegistered.php   ✅
    │   ├── Listeners\SendAdminNewCompanyAlert.php  ✅
    │   ├── Mail\OtpEmail.php             ✅
    │   ├── Mail\WelcomeEmail.php         ✅
    │   ├── Mail\AdminNewCompanyEmail.php  ✅
    │   └── Models\                        ✅ all 11 models
    ├── database\migrations\               ✅ 15 migrations
    ├── routes\api.php                     ✅ 8 routes
    └── resources\views\emails\
        ├── otp.blade.php                  ✅
        ├── welcome.blade.php              ✅
        └── admin_new_company.blade.php    ✅
```

---

## 13. Environment / Config

### Backend `.env` (key values):
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iitism_cdc
DB_USERNAME=root
DB_PASSWORD=         ← (blank for XAMPP default)
QUEUE_CONNECTION=database
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_user   ← NEEDS real credentials
MAIL_PASSWORD=your_mailtrap_pass   ← NEEDS real credentials
MAIL_FROM_ADDRESS=cdc@iitism.ac.in
```

### Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_SECRET=<must be set>
NEXTAUTH_URL=http://localhost:3000
```

---

## 14. How to Run the Project

### Backend:
```bash
cd c:\DBMS_PROJECT\iitism-cdc-api
# Start XAMPP (Apache + MySQL)
php artisan serve --port=8000
# Queue worker (for emails):
php artisan queue:work
```

### Frontend:
```bash
cd c:\DBMS_PROJECT\iitism-cdc-frontend
npm run dev   # runs on http://localhost:3000
```

---

## 15. Active Departments (status=1 only)

| ID | Full Name |
|----|-----------|
| agl | Applied Geology |
| agp | Applied Geophysics |
| ccb | Chemistry and Chemical Biology |
| ce | Chemical Engineering |
| ciie | Centre for Innovation Incubation and Entrepreneurship |
| cse | Computer Science and Engineering |
| cve | Civil Engineering |
| ece | Electronics Engineering |
| ee | Electrical Engineering |
| ese | Environmental Science & Engineering |
| fme | Fuel, Minerals and Metallurgical Engineering |
| hss | Humanities and Social Sciences |
| mc | Mathematics and Computing |
| me | Mining Engineering |
| mech | Mechanical Engineering |
| msie | Management Studies and Industrial Engineering |
| pe | Petroleum Engineering |
| phy | Physics |

---

## 16. Active Courses (Programmes)

| ID | Full Name | Duration |
|----|-----------|----------|
| b.tech | Bachelor of Technology | 4 years |
| be | Bachelor of Engineering | 4 years |
| dualdegree | Dual Degree | 5 years |
| int.m.sc | Integrated Master of Science | 5 years |
| int.m.tech | Integrated Master of Technology | 5 years |
| m.sc | Master of Science | 2 years |
| m.tech | Master of Technology | 2 years |
| mba | Master of Business Administration | 2 years |
| jrf | Doctor of Philosophy | 7 years |
| (+ more variants in constants.ts) | | |

---

## 17. What NOT to Do

- Never use `any` TypeScript type — always define proper interfaces
- Never hardcode API URLs — always use `process.env.NEXT_PUBLIC_API_URL`
- Never use `useEffect` for form state — use `react-hook-form` `watch()`
- Never use inline styles — use MUI `sx` prop or `styled()`
- Never use `.js` or `.jsx` — always `.tsx`
- Never use `console.log` in production code
- Never skip loading states — every API call must have a skeleton or spinner
- Never skip error states — every API call must handle and display errors
- Never use deprecated departments (status=0): Applied Chemistry, Applied Mathematics, Applied Physics
- MUI v6.5 uses `Grid` with `item` prop — do NOT use Grid v2 syntax (`Grid2`) unless explicitly upgraded

---

## 18. Next Immediate Steps (Priority Order)

1. **Complete Login Page** (Prompt 14) — full split-panel UI with react-hook-form and NextAuth signIn
2. **Forgot/Reset Password** (Prompt 15) — backend AuthController methods + frontend pages
3. **Company Dashboard** (Prompt 16) — `DashboardController` in Laravel + real data in frontend
4. **JNF Form Shell** (Prompt 17) — create draft on mount, 7-step sidebar stepper, auto-save
5. **JNF Sections 1-7** (Prompts 18-23) — build sequentially
6. **Admin Panel** (Prompts 25-32) — after JNF is working

---

## 19. Full Prompt Roadmap (for reference)

| # | Phase | Description | Status |
|---|-------|-------------|--------|
| 1–6 | Foundation | Next.js init, Laravel init, all DB migrations | ✅ Done |
| 7 | Foundation | All models + seeder | ✅ Done |
| 8 | Foundation | NextAuth config + route protection | ✅ Done |
| 9–10 | Auth | OTP API + email templates | ✅ Done |
| 11–13 | Auth | Registration wizard (3 steps) | ✅ Done |
| 14 | Auth | Login page | ❌ Stub only |
| 15 | Auth | Forgot/reset password | ❌ Not started |
| 16 | Auth | Company dashboard | ❌ Stub only |
| 17–23 | JNF | JNF 7-section form | ❌ Not started |
| 24 | INF | INF form variant | ❌ Not started |
| 25–32 | Admin | Full admin panel | ❌ Not started |
| 33–40 | Polish | UX, security, mobile | ❌ Not started |
| 41–48 | Final | Testing, docs, build | ❌ Not started |

---

*Last updated: 2026-04-06 by Antigravity. Reflects actual code in `c:\DBMS_PROJECT`.*
