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
- **MUI TextField** (multiline) for JD/Rich-text (React 19 compatible — replaces react-quill)
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
(Migrations, Models, Essential Providers, theme, constants)

### Phase 2: Authentication & Registration — COMPLETE ✅
- **Registration wizard** (3-step with OTP verification).
- **Login Page** — Full split-panel UI with next-auth implementation; stores Sanctum tokens in localStorage.
- **Middleware Integration** — Role-based protection for /dashboard, /jnf, /inf, /admin; honors `callbackUrl`.
- **Dashboard API** — `DashboardController` in Laravel delivering real stats and submission history.

### Phase 3: JNF & INF Portals — COMPLETE ✅
- **JNF Form Shell** — 7-step stepper with 30s auto-save and real-time validation.
- **JNF Sections 1-7** — Complete implementation (Profile, Contacts, Job Profile, Eligibility, Salary, Selection, Declaration).
- **INF Form adaptation** — Reuses JNF sections with "Internship Profile" labeling and custom StipendSection.
- **Backend Controllers** — `JnfController` and `InfController` with **deep validation** and **data mapping** logic (fixes 400/500 submission errors).
- **Authorised Signatory** — Signatory preview with cursive font and AIPC guidelines checkbox.
- **React 19 Fixes** — Replaced `react-quill` with MUI multiline `TextField` to avoid `findDOMNode` errors.

---

## 4. What Has NOT Been Done Yet ❌ (Pending)

### Phase 4 — Admin Panel (Prompts 25–32):
- [ ] **Prompt 25:** Admin layout + dashboard (sidebar nav, stats overview)
- [ ] **Prompt 26:** Companies list (search, filter, approve/suspend)
- [ ] **Prompt 27:** Submissions list (all JNFs/INFs, filter by status, season)
- [ ] **Prompt 28:** Form review page (full view, approve/reject/request changes with email)
- [ ] **Prompt 29:** Email templates for admin actions + notification service
- [ ] **Prompt 30:** Admin notifications page + settings
- [ ] **Prompt 31:** Resubmission flow + admin field editing with audit log
- [ ] **Prompt 32:** PDF generation (barryvdh/laravel-dompdf) + version history

### Phase 5 — Polish (Prompts 33–40):
- [ ] **Prompt 33:** Public landing page (branding, stats, "For Recruiters", "For Students")
- [ ] **Prompt 34:** Profile edit & completion guard (prompt if profile incomplete)
- [ ] **Prompt 35:** Auto-save UX (visual indicator of "Saving..." and "Last saved at...")
- [ ] **Prompt 36:** Rate limiting and advanced API validation

### Phase 6 — Final (Prompts 41–48):
- [ ] **Prompt 41:** Postman collection and TypeScript strict mode audit
- [ ] **Prompt 42:** Form preview modal (review full form before submit)
- [ ] **Prompt 43:** Admin reporting exports (CSV/Excel for Superset)

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

### `jnf_contacts`
- `jnf_id`, `data` (json containing all PoC details), `created_at`, `updated_at`.

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
│       │   │   ├── login\page.tsx          ✅ Full UI + callbackUrl fix
│       │   │   └── register\page.tsx       ✅ 3-step wizard
│       │   ├── (company)\
│       │   │   ├── dashboard\page.tsx      ✅ Integrated with DashboardClient
│       │   │   ├── jnf\new\page.tsx        ✅ Renders JnfFormShell
│       │   │   └── inf\new\page.tsx        ✅ Renders InfFormShell
│       ├── components\
│       │   ├── forms\
│       │   │   ├── jnf\
│       │   │   │   ├── JnfFormShell.tsx    ✅ 7-step orchestration
│       │   │   │   └── sections\           ✅ All 7 sections (CompanyProfile...Declaration)
│       │   │   └── inf\
│       │   │       ├── InfFormShell.tsx    ✅ INF specific orchestration
│       │   │       └── sections\           ✅ StipendSection.tsx
│       ├── lib\
│       │   └── api.ts                     ✅ Axios instance + getSession interceptor
│       ├── types\
│       │   └── next-auth.d.ts             ✅ Augmented Session with accessToken
│       └── middleware.ts                  ✅ CallbackUrl + JNF/INF bypass logic
│
└── iitism-cdc-api\
    ├── app\
    │   ├── Http\Controllers\Api\
    │   │   ├── AuthController.php         ✅ Login/Register/OTP
    │   │   └── Company\
    │       │   ├── DashboardController.php ✅ Stats & Submissions
    │       │   ├── JnfController.php       ✅ JNF CRUD
    │       │   ├── InfController.php       ✅ INF CRUD
    │       │   └── ProfileController.php   ✅ Profile updates
    │   ├── Models\                        ✅ All 11 models (User, Company, JNF...)
    │   ├── Events\                        ✅ CompanyRegistered
    │   ├── Listeners\                     ✅ SendAdminNewCompanyAlert
    │   └── Mail\                          ✅ Otp, Welcome, AdminAlert templates
    ├── routes\api.php                     ✅ All 8+ routes mapped
    └── resources\views\emails\            ✅ All blade templates
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

1. **Admin Layout & Dashboard** (Prompt 25) — Sidebar navigation and overview stats for CDC staff.
2. **Companies Management** (Prompt 26) — Admin interface to approve or suspend companies.
3. **Submissions List** (Prompt 27) — Filterable list of all JNF/INF forms for administrative review.
4. **Form Review & Approval** (Prompt 28) — Multi-tab review page with action buttons (Approve/Reject).

---

## 19. Full Prompt Roadmap (for reference)

| # | Phase | Description | Status |
|---|-------|-------------|--------|
| 1-13 | Foundation/Auth | Init, DB, next-auth, Register wizard | ✅ Done |
| 14 | Auth | Login page | ✅ Done |
| 15 | Auth | Forgot/reset password | ❌ Pending |
| 16 | Auth | Company dashboard | ✅ Done |
| 17-23 | JNF | JNF 7-section form wizard | ✅ Done |
| 24 | INF | INF form variant + Stipend | ✅ Done |
| 25-32 | Admin | Full admin panel | ❌ Not started |
| 33-40 | Polish | UX, mobile, landing page | ❌ Not started |
| 41-48 | Final | Testing, docs, build | ❌ Not started |
| - | Fixes | React 19 compat, JNF/INF Data Mapping | ✅ Done |

---

*Last updated: 2026-04-06 by Antigravity. Reflects actual code in `c:\DBMS_PROJECT`.*
