# IIT (ISM) CDC Portal — Complete 64-Prompt Build Guide
## Detailed, Step-by-Step with Phase Checkpoints Every 8 Prompts

> **IMPORTANT:** Before pasting any prompt below into your AI coding assistant (Cursor / GitHub Copilot / etc.), always paste the full contents of `CONTEXT.md` and `SKILLS.md` first. Those files are your "antigravity" — they keep the AI on track across every session.

---

# PHASE 1 — Project Foundation (Prompts 1–8)

---

### PROMPT 1 — Initialize Next.js Frontend Project

```
You are building the frontend for the IIT (ISM) Dhanbad CDC (Career Development Centre) placement portal.

Task: Create a new Next.js 15 project using the App Router with TypeScript. Do the following steps:

1. Scaffold the project with: npx create-next-app@latest iitism-cdc-frontend --typescript --app --src-dir --import-alias "@/*"

2. Install all required packages:
   npm install @mui/material@6.5 @mui/icons-material @emotion/react @emotion/styled
   npm install @mui/x-date-pickers dayjs
   npm install next-auth@5
   npm install axios
   npm install react-hook-form @hookform/resolvers zod
   npm install react-hot-toast
   npm install react-quill

3. Create the MUI theme at src/theme/theme.ts with these EXACT settings:
   - Primary color: #1a237e (IIT ISM dark navy blue)
   - Secondary color: #b71c1c (IIT ISM deep red)
   - Background default: #f5f5f5
   - Font family: Inter, Roboto, Helvetica, Arial, sans-serif
   - MuiButton: borderRadius 8px, textTransform none, fontWeight 600
   - MuiCard: borderRadius 12px, boxShadow '0 2px 8px rgba(0,0,0,0.08)'
   - MuiTextField default props: variant outlined, size medium

4. Create src/app/layout.tsx as the root layout that:
   - Wraps children in MUI ThemeProvider using the theme above
   - Wraps in MUI CssBaseline
   - Wraps in next-auth SessionProvider
   - Wraps in Toaster from react-hot-toast
   - Includes Inter Google font via next/font

5. Create the .env.local file with:
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXTAUTH_SECRET=iitism_cdc_secret_2024
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_key_here

ALL files must be .tsx. No .js or .jsx files.
```

---

### PROMPT 2 — Create Project Folder Structure and Base Files

```
Context: We are building the IIT ISM CDC placement portal with Next.js 15 App Router, TypeScript, MUI v6.5.

Task: Create the complete folder structure and foundational files. Do not add page content yet — just create the files with the correct exports and placeholder content.

1. Create these route group folders and their page.tsx files (each with just a placeholder export for now):
   src/app/(public)/page.tsx         ← Landing page
   src/app/(auth)/login/page.tsx     ← Login page
   src/app/(auth)/register/page.tsx  ← Registration wizard
   src/app/(company)/dashboard/page.tsx
   src/app/(company)/jnf/new/page.tsx
   src/app/(company)/jnf/[id]/page.tsx
   src/app/(company)/inf/new/page.tsx
   src/app/(company)/inf/[id]/page.tsx
   src/app/(admin)/admin/dashboard/page.tsx
   src/app/(admin)/admin/companies/page.tsx
   src/app/(admin)/admin/submissions/page.tsx
   src/app/(admin)/admin/submissions/[id]/page.tsx
   src/app/(admin)/admin/notifications/page.tsx
   src/app/(admin)/admin/settings/page.tsx
   src/app/api/auth/[...nextauth]/route.ts

2. Create these component folders (empty index files):
   src/components/ui/
   src/components/forms/jnf/
   src/components/forms/inf/
   src/components/forms/shared/
   src/components/layout/
   src/components/admin/

3. Create src/lib/api.ts — the centralized axios instance:
   - baseURL from process.env.NEXT_PUBLIC_API_URL
   - Request interceptor: attach Bearer token from next-auth session
   - Response interceptor: redirect to /login on 401
   - Export typed helper methods: get<T>, post<T>, put<T>, patch<T>, delete<T>
   - Each method returns Promise<T> and handles AxiosError properly

4. Create src/lib/constants.ts with all data from the CSVs:
   - DEPARTMENTS array: only status=1 entries from departments CSV (18 active departments)
   - BRANCHES array: only status=1 entries from branches CSV (all active branches)
   - COURSES array: only status=1 entries from courses CSV
   - ORG_TYPES: ['PSU', 'MNC', 'Startup', 'NGO', 'Private', 'Government', 'Other']
   - SECTORS: 18 industry sectors
   - CURRENCIES: ['INR', 'USD', 'EUR']
   - WORK_MODES: ['onsite', 'remote', 'hybrid']
   - GENDER_FILTERS: ['all', 'male', 'female', 'other']
   - RECRUITMENT_SEASONS: ['2024-25', '2025-26', '2026-27']
   - STATUS_CONFIG: object mapping each status (draft/submitted/under_review/approved/rejected) to label and MUI color

5. Create src/types/index.ts with ALL TypeScript interfaces:
   User, Company, CompanyContact, JnfForm, FormStatus, JnfJobProfile, JnfEligibility,
   ProgrammeEligibility, SalaryRow, JnfSalary, AdditionalComponent,
   SelectionStage, JnfSelectionProcess, Notification, ApiResponse<T>, PaginatedResponse<T>

ALL files must be .tsx or .ts. Use proper TypeScript — no 'any' types.
```

---

### PROMPT 3 — Initialize Laravel Backend Project

```
Context: We are building the backend API for the IIT ISM CDC placement portal using Laravel 11 with PHP 8.2 (via XAMPP), MySQL/MariaDB managed with HeidiSQL.

Task: Set up the Laravel 11 backend project completely.

1. Create new project:
   composer create-project laravel/laravel iitism-cdc-api

2. Install required packages:
   composer require laravel/sanctum
   composer require barryvdh/laravel-dompdf
   composer require intervention/image

3. Configure src/config/cors.php:
   - allowed_origins: ['http://localhost:3000']
   - allowed_methods: ['*']
   - allowed_headers: ['*']
   - supports_credentials: true

4. Configure .env file with:
   APP_NAME="IIT ISM CDC Portal"
   APP_URL=http://localhost:8000
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=iitism_cdc
   DB_USERNAME=root
   DB_PASSWORD=
   FRONTEND_URL=http://localhost:3000
   MAIL_MAILER=smtp
   MAIL_HOST=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_mailtrap_user
   MAIL_PASSWORD=your_mailtrap_pass
   MAIL_FROM_ADDRESS=cdc@iitism.ac.in
   MAIL_FROM_NAME="IIT ISM CDC"

5. Run: php artisan key:generate
6. Run: php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
7. Add Sanctum middleware to api middleware group in bootstrap/app.php

8. Create the database iitism_cdc in MySQL (via HeidiSQL or CLI):
   CREATE DATABASE iitism_cdc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

9. Set up routes/api.php with just a health check route for now:
   Route::get('/health', fn() => response()->json(['status' => 'ok', 'service' => 'IIT ISM CDC API']));

Verify with: php artisan serve --port=8000
Then test: GET http://localhost:8000/api/health should return {"status":"ok"}
```

---

### PROMPT 4 — Database Migrations Part 1: Users and Companies

```
Context: IIT ISM CDC Portal backend (Laravel 11, MySQL). We need to create the core database tables.

Task: Create these migrations in order. Run them at the end.

MIGRATION 1 — users table (modify the default Laravel users migration):
Fields:
- id (bigIncrements)
- name (string, max 255)
- email (string, unique)
- password (string, hashed)
- role (enum: 'company', 'admin', default 'company')
- email_verified_at (timestamp, nullable)
- otp (string 6, nullable) — for registration OTP
- otp_expires_at (timestamp, nullable)
- is_active (boolean, default true)
- remember_token (string 100, nullable)
- timestamps()

MIGRATION 2 — companies table:
Fields:
- id (bigIncrements)
- user_id (foreignId → users, cascade delete)
- company_name (string, max 255)
- website (string, max 500, nullable)
- sector (string, max 255) — one of the 18 sectors
- org_type (enum: 'PSU','MNC','Startup','NGO','Private','Government','Other')
- nature_of_business (text, nullable)
- date_of_establishment (date, nullable)
- annual_turnover (string, nullable) — stored as text e.g. "₹500 Cr"
- no_of_employees (string, nullable) — e.g. "500-1000"
- hq_country (string, nullable) — only if MNC
- hq_city (string, nullable) — only if MNC
- industry_tags (json, nullable) — array of tag strings
- social_media_url (string, nullable)
- description (text, nullable)
- logo_path (string, nullable) — path in storage
- postal_address (text, nullable)
- is_profile_complete (boolean, default false)
- timestamps()

MIGRATION 3 — company_contacts table:
Fields:
- id (bigIncrements)
- company_id (foreignId → companies, cascade delete)
- contact_type (enum: 'head_hr', 'poc_1', 'poc_2')
- full_name (string, max 255)
- designation (string, max 255)
- email (string)
- mobile (string, max 15)
- alt_mobile (string, nullable, max 15)
- landline (string, nullable, max 20)
- timestamps()

After creating migrations run: php artisan migrate
Confirm all 3 tables created without errors in HeidiSQL.
```

---

### PROMPT 5 — Database Migrations Part 2: JNF/INF Core Tables

```
Context: IIT ISM CDC Portal backend (Laravel 11). We have users, companies, company_contacts tables. Now create JNF/INF related tables.

Task: Create these migrations.

MIGRATION 1 — job_notification_forms table (covers both JNF and INF):
Fields:
- id (bigIncrements)
- company_id (foreignId → companies, cascade delete)
- season (string, e.g. "2024-25") — from RECRUITMENT_SEASONS constant
- form_type (enum: 'JNF', 'INF')
- status (enum: 'draft', 'submitted', 'under_review', 'approved', 'rejected', default 'draft')
- submitted_at (timestamp, nullable)
- reviewed_at (timestamp, nullable)
- reviewed_by (foreignId → users, set null on delete, nullable)
- review_comments (text, nullable)
- admin_notes (text, nullable) — internal CDC notes, never shown to company
- rejection_reason (text, nullable)
- version (integer, default 1) — increments on resubmission
- parent_form_id (foreignId → job_notification_forms, nullable) — for tracking revisions
- timestamps()

MIGRATION 2 — jnf_job_profiles table:
Fields:
- id (bigIncrements)
- jnf_id (foreignId → job_notification_forms, cascade delete)
- job_title (string, max 255)
- designation (string, max 255, nullable)
- place_of_posting (string, max 500)
- work_mode (enum: 'onsite', 'remote', 'hybrid', default 'onsite')
- expected_hires (integer)
- min_hires (integer, nullable)
- tentative_joining (string, max 20) — store as "MM/YYYY" e.g. "06/2025"
- skills (json, nullable) — array of skill tag strings
- jd_text (longText, nullable) — rich text HTML
- jd_pdf_path (string, nullable) — storage path
- ppo_provision (boolean, default false) — for INF: Pre-Placement Offer
- registration_link (string, nullable)
- additional_info (text, nullable, max 1000 chars)
- bond_details (text, nullable)
- onboarding_procedure (text, nullable)
- timestamps()

MIGRATION 3 — jnf_eligibility table:
Fields:
- id (bigIncrements)
- jnf_id (foreignId → job_notification_forms, cascade delete)
- programmes (json) — array of { course_id: string, branch_ids: string[] }
- min_cgpa (decimal 3,1, nullable) — e.g. 6.5
- backlogs_allowed (boolean, default false)
- highschool_percent (decimal 5,2, nullable) — e.g. 60.00
- gender_filter (enum: 'all', 'male', 'female', 'other', default 'all')
- per_discipline_cgpa (json, nullable) — { branch_id: cgpa_value }
- special_requirements (text, nullable) — SLP related requirements
- timestamps()

Run: php artisan migrate
Verify 4 new tables created.
```

---

### PROMPT 6 — Database Migrations Part 3: Salary, Selection, and Support Tables

```
Context: IIT ISM CDC Portal backend (Laravel 11). We have the core JNF tables. Now create the remaining data tables.

Task: Create these final migrations.

MIGRATION 1 — jnf_salary table (covers both JNF salary and INF stipend):
Fields:
- id (bigIncrements)
- jnf_id (foreignId → job_notification_forms, cascade delete)
- currency (enum: 'INR', 'USD', 'EUR', default 'INR')
- salary_same_for_all (boolean, default true)
- salary_data (json) — array of SalaryRow objects:
  Each row: { course_id, ctc_annual, base_fixed, monthly_takehome, ug_ctc, pg_ctc }
  For INF: { course_id, base_stipend, hra, variable_pay, other, total }
- additional_components (json, nullable) — array of:
  { name, value, per_programme, programme_values: { course_id: value } }
- timestamps()

MIGRATION 2 — jnf_selection_process table:
Fields:
- id (bigIncrements)
- jnf_id (foreignId → job_notification_forms, cascade delete)
- stages (json) — array of SelectionStage objects:
  Each: { stage_type, label, enabled, mode, test_type, duration_minutes, interview_mode, custom_label }
  stage_type: 'ppt' | 'resume' | 'test' | 'gd' | 'interview' | 'custom'
  mode: 'online' | 'offline' | 'hybrid'
  test_type: 'aptitude' | 'technical' | 'written' | null
  interview_mode: 'on_campus' | 'telephonic' | 'video' | null
- infrastructure_required (text, nullable)
- psychometric_test (boolean, default false)
- medical_test (boolean, default false)
- other_screening (text, nullable)
- timestamps()

MIGRATION 3 — jnf_declaration table:
Fields:
- id (bigIncrements)
- jnf_id (foreignId → job_notification_forms, cascade delete)
- aipc_agreed (boolean, default false)
- shortlisting_agreed (boolean, default false)
- info_verified (boolean, default false)
- ranking_consent (boolean, default false)
- accuracy_confirmed (boolean, default false)
- rti_nirf_consent (boolean, default false)
- signatory_name (string, nullable)
- signatory_designation (string, nullable)
- signatory_date (date, nullable)
- typed_signature (string, nullable)
- timestamps()

MIGRATION 4 — notifications table:
Fields:
- id (bigIncrements)
- user_id (foreignId → users, cascade delete)
- type (string) — e.g. 'company_registered', 'form_submitted', 'form_approved'
- title (string)
- message (text)
- data (json, nullable) — extra context like form_id, company_id
- is_read (boolean, default false)
- created_at, updated_at

MIGRATION 5 — form_audit_log table:
Fields:
- id (bigIncrements)
- jnf_id (foreignId → job_notification_forms, cascade delete)
- action (string) — e.g. 'submitted', 'approved', 'rejected', 'edited_by_admin', 'resubmitted'
- performed_by (foreignId → users, set null on delete)
- section_edited (string, nullable) — which section admin edited
- note (text, nullable)
- old_data (json, nullable) — snapshot before edit
- created_at (timestamp only, no updated_at)

MIGRATION 6 — otp_verifications table:
Fields:
- id (bigIncrements)
- email (string)
- otp (string 6)
- expires_at (timestamp)
- is_used (boolean, default false)
- created_at

Run: php artisan migrate
Verify all tables in HeidiSQL. Total tables should now be: users, companies, company_contacts, job_notification_forms, jnf_job_profiles, jnf_eligibility, jnf_salary, jnf_selection_process, jnf_declaration, notifications, form_audit_log, otp_verifications.
```

---

### PROMPT 7 — Laravel Models, Relationships, and Seeder

```
Context: IIT ISM CDC Portal (Laravel 11). All migrations are complete. Now create Eloquent models and seed initial data.

Task:

1. Create Eloquent Models with full relationships:

User model (app/Models/User.php):
- $fillable: name, email, password, role, otp, otp_expires_at, is_active
- $hidden: password, remember_token, otp
- $casts: email_verified_at → datetime, otp_expires_at → datetime, is_active → boolean
- relationship: hasOne(Company::class)

Company model:
- $fillable: all fields
- $casts: industry_tags → array, is_profile_complete → boolean
- relationships: belongsTo(User::class), hasMany(CompanyContact::class), hasMany(JobNotificationForm::class)

CompanyContact model:
- $fillable: all fields
- relationship: belongsTo(Company::class)

JobNotificationForm model:
- $fillable: all fields
- $casts: submitted_at, reviewed_at → datetime
- relationships:
  - belongsTo(Company::class)
  - hasOne(JnfJobProfile::class, 'jnf_id')
  - hasOne(JnfEligibility::class, 'jnf_id')
  - hasOne(JnfSalary::class, 'jnf_id')
  - hasOne(JnfSelectionProcess::class, 'jnf_id')
  - hasOne(JnfDeclaration::class, 'jnf_id')
  - belongsTo(User::class, 'reviewed_by')
  - hasMany(FormAuditLog::class, 'jnf_id')

JnfJobProfile, JnfEligibility, JnfSalary, JnfSelectionProcess, JnfDeclaration models:
- Each has $fillable for all its columns
- Each has $casts for json fields → array
- Each belongsTo(JobNotificationForm::class, 'jnf_id')

Notification model:
- $fillable: all fields
- $casts: data → array, is_read → boolean

FormAuditLog model:
- $fillable: all fields
- $casts: old_data → array
- timestamps: false (only created_at)

2. Create Database Seeder (database/seeders/DatabaseSeeder.php):

Seed 1 admin user:
- name: "CDC Admin"
- email: "admin@iitism.ac.in"
- password: Hash::make("Admin@IITISM#2024")
- role: "admin"
- is_active: true

Seed 1 test company user:
- name: "Test Company HR"
- email: "hr@testcompany.com"
- password: Hash::make("Company@123")
- role: "company"
And its company record:
- company_name: "Test Technologies Pvt. Ltd."
- sector: "Information Technology"
- org_type: "Private"
- nature_of_business: "Software Development and IT Services"
- postal_address: "123 Tech Park, Bangalore, Karnataka 560001"

3. Run: php artisan db:seed
Verify in HeidiSQL that both users and the company record are created.
```

---

### PROMPT 8 — NextAuth Configuration and Route Protection

```
Context: IIT ISM CDC Portal (Next.js 15, TypeScript, NextAuth v5). Backend is running at localhost:8000.

Task: Set up complete authentication for the Next.js frontend.

1. Create src/app/api/auth/[...nextauth]/route.ts:
   Configure NextAuth with credentials provider that:
   - Accepts email (string) and password (string)
   - Calls POST http://localhost:8000/api/auth/login via axios
   - On success: returns user object with id, name, email, role, accessToken
   - On failure: returns null (triggers NextAuth error)
   - Callback jwt: stores accessToken, role, id in the JWT token
   - Callback session: exposes user.id, user.role, user.accessToken on the session
   - Session strategy: jwt
   - Pages: signIn at /login

2. Create src/types/next-auth.d.ts to extend NextAuth types:
   Extend Session to include user.role ('company' | 'admin') and user.accessToken (string)
   Extend JWT to include accessToken, role, id

3. Create src/middleware.ts for route protection:
   - Routes starting with /admin require role === 'admin', redirect to /login if not
   - Routes starting with /dashboard, /jnf, /inf require role === 'company', redirect to /login
   - Routes /login and /register redirect to /dashboard if already logged in as company
   - Routes /login and /register redirect to /admin/dashboard if already logged in as admin
   - Use the matcher to only run on app routes (not _next, api, static files)

4. Create Laravel AuthController (app/Http/Controllers/Api/AuthController.php):
   Method: login(Request $request)
   - Validate: email (required, email), password (required, string)
   - Attempt auth with Auth::attempt()
   - If fails: return 401 with message "Invalid credentials"
   - If user is_active is false: return 403 with "Account suspended. Contact CDC."
   - Issue Sanctum token with abilities based on role: ['role:admin'] or ['role:company']
   - Return: { success: true, data: { user: { id, name, email, role }, token } }

5. Add route: POST /api/auth/login in routes/api.php (no auth middleware needed for this)

6. Test: Start both servers, verify login with admin@iitism.ac.in / Admin@IITISM#2024 returns a token.
```

---

## ✅ PHASE 1 CHECKPOINT — Run This After Prompt 8

```
Verify ALL of the following before proceeding to Phase 2:

□ Next.js project starts without errors: npm run dev → localhost:3000 opens
□ Laravel API starts without errors: php artisan serve --port=8000
□ GET http://localhost:8000/api/health returns {"status":"ok"}
□ All 12 database tables exist in HeidiSQL
□ Admin user seeded: admin@iitism.ac.in
□ Test company user seeded: hr@testcompany.com
□ POST http://localhost:8000/api/auth/login with admin credentials returns token
□ POST http://localhost:8000/api/auth/login with wrong password returns 401
□ src/lib/constants.ts has all departments, branches, courses from CSV
□ src/types/index.ts has all TypeScript interfaces
□ All created files are .tsx or .ts (zero .js or .jsx files)
□ Route protection middleware is in place (middleware.ts exists)

If any check fails, fix it before continuing.
```

---

# PHASE 2 — Authentication & Registration (Prompts 9–16)

---

### PROMPT 9 — OTP Registration API (Laravel)

```
Context: IIT ISM CDC Portal (Laravel 11). Building the company registration flow. Companies register with OTP verification on their company email.

Task: Build the complete registration API in Laravel.

1. Create app/Http/Controllers/Api/AuthController.php (add to existing):

Method: sendOtp(Request $request)
- Validate: email (required, email format)
- Check if email already exists in users table → return 409: "Email already registered. Please login."
- Generate a cryptographically random 6-digit OTP: str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT)
- Delete any previous OTPs for this email from otp_verifications table
- Insert new record: { email, otp, expires_at: now()->addMinutes(5), is_used: false }
- Queue email via Mail::to($email)->queue(new OtpEmail($otp, $email))
- Return: { success: true, message: "OTP sent to your email. Valid for 5 minutes." }

2. Create app/Mail/OtpEmail.php:
- Mailable class with build() method
- Subject: "Your IIT ISM CDC Registration OTP"
- Use a Blade view: resources/views/emails/otp.blade.php
- Pass $otp and $email to the view

3. Create resources/views/emails/otp.blade.php:
- Clean HTML email template
- IIT ISM CDC header with navy (#1a237e) background and white text
- Large, bold OTP code in a highlighted box
- "Valid for 5 minutes" warning text
- Footer with CDC contact: cdc@iitism.ac.in | +91-326-2235000

4. Method: verifyOtp(Request $request)
- Validate: email (required, email), otp (required, string, size:6)
- Find record in otp_verifications where email matches, is_used=false, expires_at > now()
- If not found: return 400 "Invalid or expired OTP"
- If found: mark is_used = true
- Return: { success: true, message: "Email verified successfully." }

5. Method: register(Request $request)
- Validate all fields:
  * full_name: required, string, max:255
  * designation: required, string, max:255
  * mobile: required, string, regex:/^[6-9]\d{9}$/ (Indian mobile)
  * alt_mobile: nullable, string, regex same
  * email: required, email, unique:users
  * password: required, string, min:8, confirmed
  * password must contain: uppercase, lowercase, digit, special char (use regex)
  * company_name: required, string, max:255
  * website: nullable, url
  * sector: required, in: [all 18 sector values]
  * org_type: required, in: PSU,MNC,Startup,NGO,Private,Government,Other
  * postal_address: required, string
- Create User: { name: full_name, email, password: Hash::make(password), role: 'company' }
- Create Company: { user_id, company_name, website, sector, org_type, postal_address }
- Create CompanyContact: { company_id, contact_type: 'poc_1', full_name, designation, email, mobile, alt_mobile }
- Send WelcomeEmail to company (include login URL and credentials)
- Fire AdminNotification event to notify admin of new company
- Return: { success: true, message: "Registration successful. Check your email for login details." }

6. Add routes in api.php:
   POST /api/auth/send-otp (rate limited: 5 per minute per IP)
   POST /api/auth/verify-otp
   POST /api/auth/register
```

---

### PROMPT 10 — Email Templates for Registration (Laravel)

```
Context: IIT ISM CDC Portal (Laravel 11). Need professional HTML email templates for all registration-related emails.

Task: Create all email Mailable classes and their Blade templates.

1. app/Mail/WelcomeEmail.php — sent to company after successful registration:
   Constructor receives: $userName, $companyName, $email, $password
   Subject: "Welcome to IIT (ISM) Dhanbad CDC Portal — Your Login Details"
   Template: resources/views/emails/welcome.blade.php
   
   Template content:
   - IIT ISM CDC branded header (navy #1a237e, white logo text)
   - "Welcome, [company_name]!" heading
   - "Your account has been created successfully." paragraph
   - Credentials box (light grey background):
     * Email: [email]
     * Password: [password]
     * Login URL: http://localhost:3000/login
   - "Please change your password after first login" notice
   - "What's next?" section:
     1. Login to the portal
     2. Complete your company profile
     3. Submit JNF or INF form
   - Footer: Career Development Centre | IIT (ISM) Dhanbad | cdc@iitism.ac.in

2. app/Mail/AdminNewCompanyAlert.php — sent to admin when new company registers:
   Constructor receives: $company (Company model with user)
   Subject: "[CDC Alert] New Company Registered: [company_name]"
   Template: resources/views/emails/admin_new_company.blade.php
   
   Template content:
   - Alert header (navy background)
   - "New Company Registration" heading
   - Company details table:
     * Company Name, Sector, Org Type, Website
     * Contact Person, Email, Mobile
     * Registered At (timestamp)
   - "Review Company" button linking to: http://localhost:3000/admin/companies
   - Footer

3. Create app/Listeners/SendAdminNewCompanyAlert.php:
   - Listens to CompanyRegistered event
   - Sends AdminNewCompanyAlert email to admin@iitism.ac.in
   - Also creates a Notification record in DB:
     { user_id: admin_user_id, type: 'company_registered', title: 'New Company Registered',
       message: "[company_name] has registered and is awaiting review",
       data: { company_id, company_name, registered_at } }

4. Create app/Events/CompanyRegistered.php:
   - Has $company property (Company model)

5. Register in EventServiceProvider (or bootstrap/app.php in Laravel 11):
   CompanyRegistered → SendAdminNewCompanyAlert

Verify by triggering registration and checking:
- Mailtrap inbox receives OTP email
- After register: company receives welcome email
- Admin receives new company alert email
```

---

### PROMPT 11 — Registration Page UI — Step 1: Email OTP (Next.js)

```
Context: IIT ISM CDC Portal (Next.js 15, TypeScript, MUI v6.5). Building the company registration wizard.

Task: Build the registration page at src/app/(auth)/register/page.tsx

This is a 3-step wizard. Build only STEP 1 in this prompt (Steps 2 and 3 in next prompts).

Page structure:
- Centered layout, no sidebar
- IIT ISM CDC logo/text at top (text-based: "IIT (ISM) Dhanbad" above "Career Development Centre")
- MUI Stepper at top with 3 steps: "Email Verification" | "Recruiter Details" | "Company Profile"
- Active step content below the stepper
- Back/Next buttons at bottom of each step

STEP 1 — Email Verification:
Component: src/components/forms/shared/EmailVerificationStep.tsx

UI:
- Heading: "Verify Your Company Email"
- Subtext: "Enter your official company email address to receive an OTP"
- Email TextField (required, email validation)
- "Send OTP" Button (primary, full width)
- On send success: show a 6-digit OTP input (6 separate MUI TextField boxes or a single field)
- Show countdown timer: "OTP expires in 4:57" counting down from 5:00
- "Resend OTP" link (disabled until timer reaches 0:00)
- "Verify & Continue" button (disabled until 6 digits entered)

State management with react-hook-form:
- Field: email (required, must be email format)
- Field: otp (required, exactly 6 digits, numeric only)

API calls:
- POST /api/auth/send-otp with { email }
  * Loading state on button during call
  * Show success alert: "OTP sent to [email]"
  * Show error alert with API error message
- POST /api/auth/verify-otp with { email, otp }
  * Loading state on button
  * On success: call onStepComplete(1, { email }) to advance wizard
  * On error: show error message, clear OTP field

The page.tsx holds state for:
- currentStep (0, 1, 2)
- registrationData (accumulates data across steps)
- A function handleStepComplete(step, data) that advances the step

All files must be .tsx. No any types.
```

---

### PROMPT 12 — Registration Wizard — Step 2: Recruiter Details (Next.js)

```
Context: IIT ISM CDC Portal (Next.js 15, TypeScript, MUI v6.5). The registration wizard Step 1 (email OTP) is working. Now build Step 2.

Task: Build the Recruiter Details step component at src/components/forms/shared/RecruiterDetailsStep.tsx

Props interface:
  onComplete: (data: RecruiterDetailsData) => void
  onBack: () => void
  defaultValues?: Partial<RecruiterDetailsData>

interface RecruiterDetailsData:
  full_name: string
  designation: string
  mobile: string
  alt_mobile: string
  password: string
  password_confirmation: string

UI — Form fields using react-hook-form with Controller:

1. Full Name (required)
   - TextField, full width
   - Max 255 characters
   - Show character counter below: "45/255"
   - Validation: required, min 2 chars

2. Designation (required)
   - TextField, full width
   - Max 255 characters with counter
   - E.g. "HR Manager", "Talent Acquisition Lead"

3. Contact Number (required)
   - TextField with +91 prefix (InputAdornment)
   - Max 10 digits, numeric only
   - Validation: must be 10 digits, must start with 6, 7, 8, or 9

4. Alternative Mobile (optional)
   - Same as above but not required

5. Password (required)
   - TextField type="password" with show/hide toggle (IconButton with Visibility icon)
   - Min 8 characters
   - Must contain: 1 uppercase, 1 lowercase, 1 digit, 1 special character
   - Show password strength bar below (Weak/Fair/Strong using MUI LinearProgress)
   - Strength logic: Weak = <3 criteria met, Fair = 3 criteria, Strong = all 4

6. Confirm Password (required)
   - Must match password field exactly

Bottom buttons:
- "Back" button (outlined, goes to Step 1)
- "Next: Company Profile" button (contained primary, submits this step)

On valid submit: call onComplete(data) to pass data to parent and advance to Step 3.
Show all validation errors inline under each field using helperText.
```

---

### PROMPT 13 — Registration Wizard — Step 3: Company Profile (Next.js)

```
Context: IIT ISM CDC Portal (Next.js 15, TypeScript, MUI v6.5). Registration wizard Steps 1 and 2 are working. Now build Step 3 and wire up the full registration API call.

Task: Build src/components/forms/shared/CompanyProfileStep.tsx and complete the registration flow.

Props interface:
  onComplete: (data: CompanyProfileData) => void
  onBack: () => void
  defaultValues?: Partial<CompanyProfileData>

interface CompanyProfileData:
  company_name: string
  org_type: OrgType
  website: string
  sector: string
  nature_of_business: string
  postal_address: string
  date_of_establishment: string (nullable)
  annual_turnover: string (nullable)
  no_of_employees: string (nullable)
  industry_tags: string[] (nullable)
  hq_country: string (nullable)
  hq_city: string (nullable)
  social_media_url: string (nullable)
  description: string (nullable)
  logo: File | null

UI Fields:

1. Company Name (required) — TextField, max 255, with char counter

2. Organisation Type (required) — MUI Select dropdown
   Options from ORG_TYPES: PSU, MNC, Startup, NGO, Private, Government, Other
   When "MNC" is selected: show two additional fields:
     - HQ Country (TextField)
     - HQ City (TextField)

3. Website (optional) — TextField with https:// placeholder, URL validation

4. Sector (required) — MUI Select from SECTORS constant (18 options)

5. Nature of Business (required) — TextField multiline, 3 rows

6. Postal Address (required) — TextField multiline, 2 rows

7. Date of Establishment (optional) — MUI DatePicker (year and month only)
   Use @mui/x-date-pickers LocalizationProvider with dayjs adapter

8. Annual Turnover (optional) — TextField, e.g. "₹500 Crore" (NIRF field)

9. No. of Employees (optional) — MUI Select with options:
   "1-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"

10. Industry Tags (optional) — Chip-based tag input:
    TextField where pressing Enter adds a Chip below
    Show chips with delete (X) button
    Max 10 tags

11. Social Media / LinkedIn URL (optional) — TextField, URL validation

12. Company Description (optional) — TextField multiline 4 rows, max 500 chars with counter

13. Company Logo (optional) — File upload:
    MUI Button "Upload Logo" that opens file picker
    Accept: image/jpeg, image/png only
    Max size: 2MB (show error if exceeded)
    Show preview thumbnail after selection

Submit button: "Complete Registration"
On submit: call onComplete(data) in parent
Parent then calls POST /api/auth/register with all accumulated data from all 3 steps (merged).
Show loading state on button during API call.
On success: show success toast, redirect to /login with message "Registration successful! Check your email for login credentials."
On error: show MUI Alert with error message.

All files .tsx, no any types, all fields typed.
```

---

### PROMPT 14 — Login Page (Next.js)

```
Context: IIT ISM CDC Portal (Next.js 15, TypeScript, MUI v6.5, NextAuth v5).

Task: Build the professional login page at src/app/(auth)/login/page.tsx

This page handles login for BOTH companies and admins (role determined from API response).

Layout:
- Full height page (100vh), split into two panels on desktop:
  * LEFT panel (40% width): IIT ISM branding
    - Dark navy background (#1a237e)
    - IIT ISM logo area (text: "IIT (ISM) Dhanbad" in white, large)
    - Tagline: "Career Development Centre" in white, smaller
    - Key stats in white: "500+ Companies | 32+ Departments | 99+ Years of Excellence"
    - Hide this panel on mobile (display none below md breakpoint)
  * RIGHT panel (60% width on desktop, 100% on mobile): Login form
    - White background
    - Centered card with shadow
    
Login Form:
- "Welcome Back" heading (h4, dark navy)
- "IIT (ISM) Dhanbad CDC Portal" subtitle (body2, grey)
- Email Address TextField (required, email validation)
- Password TextField (required) with show/hide toggle IconButton
- "Login" Button (full width, contained primary, large size)
- Between email and password: "Forgot Password?" link aligned right
- Below Login button: "New Company? Register →" link
- Below that: "For Admin access, use your CDC credentials" small text in grey

Form handling:
- Use react-hook-form, Controller for each field
- On submit:
  1. Show loading spinner in button
  2. Call NextAuth signIn('credentials', { email, password, redirect: false })
  3. If result.error: show MUI Alert error "Invalid email or password"
  4. If result.ok: 
     * Get session to check role
     * If role === 'admin': router.push('/admin/dashboard')
     * If role === 'company': router.push('/dashboard')
- Show error states: "Account suspended. Contact CDC at cdc@iitism.ac.in"

Also create src/app/(auth)/forgot-password/page.tsx:
- Simple centered card
- Email field
- "Send Reset Link" button that calls POST /api/auth/forgot-password
- Show success message with instructions

All .tsx files. Fully responsive.
```

---

### PROMPT 15 — Forgot Password and Password Reset (Laravel + Next.js)

```
Context: IIT ISM CDC Portal. Building the password reset flow.

Task: Create both the backend API and frontend pages.

BACKEND (Laravel):

1. app/Http/Controllers/Api/AuthController.php — add methods:

forgotPassword(Request $request):
- Validate: email (required, email)
- Find user by email, return success even if not found (security)
- If found: generate token (Str::random(64)), store in password_reset_tokens table
  (Laravel's default table: email, token, created_at)
- Send PasswordResetEmail to user
- Token expires in 15 minutes
- Return: { success: true, message: "If this email exists, a reset link has been sent." }

resetPassword(Request $request):
- Validate: email, token, password (min 8, confirmed, same regex as registration)
- Verify token in password_reset_tokens table (not expired, email matches)
- Update user password: Hash::make($request->password)
- Delete all Sanctum tokens for this user (force logout all sessions)
- Delete the reset token
- Send PasswordResetConfirmation email
- Return: { success: true, message: "Password reset successfully." }

2. app/Mail/PasswordResetEmail.php:
- Subject: "Reset Your IIT ISM CDC Portal Password"
- Template: resources/views/emails/password_reset.blade.php
- Include reset link: http://localhost:3000/reset-password?token=[token]&email=[email]
- "This link expires in 15 minutes" warning
- "If you didn't request this, ignore this email" notice

3. Routes:
   POST /api/auth/forgot-password
   POST /api/auth/reset-password

FRONTEND (Next.js):

Create src/app/(auth)/reset-password/page.tsx:
- Read token and email from URL search params
- Show form: New Password + Confirm Password
- Password strength indicator (same as registration)
- Submit calls POST /api/auth/reset-password with { email, token, password, password_confirmation }
- On success: redirect to /login with success toast
- On error (expired token): show error with link to request new reset

All .tsx files.
```

---

### PROMPT 16 — Company Dashboard Home Page (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Building the company home dashboard after login.

Task: Create the company dashboard with stats and submission list.

BACKEND (Laravel):

1. Create app/Http/Controllers/Api/Company/DashboardController.php:

Method: index()
- Auth middleware required (role: company)
- Get authenticated user's company
- Calculate stats:
  * total_jnf: count of JNF forms for this company
  * total_inf: count of INF forms for this company
  * pending: count where status IN ('submitted', 'under_review')
  * approved: count where status = 'approved'
  * rejected: count where status = 'rejected'
- Get recent submissions (last 10): job_notification_forms with company, job_profile (for title), ordered by created_at desc
- Return: { success: true, data: { stats, submissions, company } }

2. Route: GET /api/company/dashboard (auth:sanctum middleware)

FRONTEND (Next.js):

Create src/app/(company)/dashboard/page.tsx:
This is a server component that checks session and renders the client component.

Create src/app/(company)/dashboard/DashboardClient.tsx (client component):

Layout:
- Top app bar: IIT ISM CDC logo left, company name + logo right, logout button
- Left sidebar (240px wide, collapsible on mobile):
  * Company name with logo thumbnail
  * Nav items: Dashboard, Submit JNF, Submit INF, My Submissions, Profile, Logout

Main content:
1. Welcome heading: "Welcome, [Company Name]!" with today's date
2. Warning banner (if company profile incomplete): "⚠️ Complete your company profile before submitting forms. [Complete Now →]"
3. Stats row — 4 MUI Cards side by side (stack on mobile):
   - 📋 Total JNFs Submitted (number in large font)
   - 📝 Total INFs Submitted
   - ⏳ Pending Review (amber colour)
   - ✅ Approved (green colour)
4. Quick Actions row: Two large buttons:
   - "Submit New JNF (Placement)" — primary contained
   - "Submit New INF (Internship)" — secondary contained
5. Recent Submissions table (MUI DataGrid or Table):
   Columns: Form Type (chip), Season, Job Title, Submitted Date, Status (colour chip), Actions
   Actions: View (eye icon), Download PDF (download icon)
   Show empty state with illustration if no submissions

Show loading skeleton while fetching.
Show error alert if fetch fails.
All .tsx files, fully responsive.
```

---

## ✅ PHASE 2 CHECKPOINT — Run This After Prompt 16

```
Verify ALL of the following before proceeding to Phase 3:

□ POST /api/auth/send-otp: sends OTP email (check Mailtrap), rate limited to 5/min
□ POST /api/auth/verify-otp: validates OTP and expiry correctly
□ POST /api/auth/register: creates user + company + contact + sends emails
□ POST /api/auth/login: returns token with role, tested in Postman
□ POST /api/auth/forgot-password: sends reset email
□ POST /api/auth/reset-password: changes password, invalidates tokens
□ Registration wizard: all 3 steps complete, data accumulates across steps
□ Login page: company login → /dashboard, admin login → /admin/dashboard
□ Dashboard: loads stats and recent submissions from real API
□ Emails received in Mailtrap: OTP, Welcome, Admin Alert, Password Reset
□ Route protection: /dashboard requires company role, /admin requires admin role
□ All new files are .tsx or .ts (verify with: find src -name "*.js" -o -name "*.jsx")

If any check fails, fix it before continuing.
```

---

# PHASE 3 — JNF/INF Form — All 7 Sections (Prompts 17–24)

---

### PROMPT 17 — JNF Form Shell, Stepper, and Auto-Save (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Building the main JNF (Job Notification Form) multi-step form. This is the core feature of the portal.

Task: Build the JNF form shell with navigation and auto-save.

BACKEND (Laravel):

1. Create app/Http/Controllers/Api/Company/JnfController.php:

create(): POST /api/jnf
- Auth: company role
- Create job_notification_forms record: { company_id, season: (current default), form_type: 'JNF', status: 'draft' }
- Return: { success: true, data: { id, status: 'draft' } }

show($id): GET /api/jnf/{id}
- Auth: company owns this form
- Return form with ALL relations eager loaded:
  company, jobProfile, eligibility, salary, selectionProcess, declaration, auditLog
- Return: { success: true, data: { ...full form object } }

saveDraft($id): PUT /api/jnf/{id}/draft
- Auth: company owns this form, form status must be 'draft'
- Accept: { section: string, data: object }
- Based on section name, upsert the corresponding child record
  (e.g. section='job_profile' → upsert jnf_job_profiles where jnf_id = $id)
- Return: { success: true, message: "Draft saved" }

FRONTEND (Next.js):

Create src/app/(company)/jnf/new/page.tsx:
- On mount: call POST /api/jnf to create draft, get jnf_id
- Store jnf_id in component state
- Render the JNF form shell

Create src/components/forms/jnf/JnfFormShell.tsx:
Props: jnfId: number, initialData?: JnfForm

Layout:
- On desktop: LEFT sidebar (260px) showing step list + progress
  Left sidebar contents:
  * "JNF Form" heading with season selector (MUI Select for RECRUITMENT_SEASONS)
  * Vertical list of 7 steps, each showing:
    - Step number badge
    - Step name
    - Completion indicator (green checkmark or grey circle)
    - Click to jump to any step
  * "Auto-saved" indicator at bottom with last saved time
- On mobile: MUI Stepper (horizontal, scrollable) at top showing steps as dots

CENTER content area: renders current step component

BOTTOM sticky bar (always visible):
- Left: "Auto-save: [time]" indicator with spinning icon when saving
- Right: "← Back" | "Save Draft" | "Next →" buttons

Auto-save logic:
- useEffect with 30-second interval: if form isDirty, call saveDraft API
- Show "Saving..." then "Saved at [HH:MM]" in the indicator

Steps list (7 steps):
1. Company Profile
2. Contact & HR Details
3. Job Profile
4. Eligibility & Courses
5. Salary Details
6. Selection Process
7. Declaration & Submit

Each step renders a lazy-loaded component: <CompanyProfileSection />, <ContactDetailsSection />, etc. (we will build these in next prompts)

Pass to each step:
- jnfId: number
- onSave: (section: string, data: object) => Promise<void>
- onComplete: (isComplete: boolean) => void (updates the step's completion indicator)
- defaultValues: the existing data for this section from initialData

All .tsx files, fully responsive. No any types.
```

---

### PROMPT 18 — JNF Section 1 & 2: Company Profile + Contact Details

```
Context: IIT ISM CDC Portal. Building JNF form sections. The form shell is working with auto-save. Now build the first two sections.

Task: Build Sections 1 and 2 of the JNF form.

SECTION 1 — Company Profile (Read-Only Pre-Fill):
Create src/components/forms/jnf/sections/CompanyProfileSection.tsx

Props:
  jnfId: number
  companyData: Company
  onSave: (section: string, data: object) => Promise<void>
  onComplete: (isComplete: boolean) => void

This section is READ-ONLY — it shows the company's registered profile data.

UI Layout:
- MUI Card with "Company Profile" header
- Row 1: Company Logo thumbnail + Company Name (large text) + Org Type chip
- Row 2: Details grid (2 columns on desktop, 1 on mobile):
  * Sector, Nature of Business, Website (clickable link), Postal Address
  * Date of Establishment, Annual Turnover, No. of Employees
  * Industry Tags (as chips), Social Media URL (clickable)
- "Edit Company Profile" outlined button at bottom right
  Clicking opens a MUI Dialog with the company profile form (same fields as registration Step 3)
  On save in dialog: calls PUT /api/company/profile, refreshes displayed data

- Season field (EDITABLE, in this section):
  MUI Select dropdown with label "Recruitment Season"
  Options from RECRUITMENT_SEASONS constant: ['2024-25', '2025-26', '2026-27']
  This updates the job_notification_forms.season field via the saveDraft API

- Show incomplete profile warning Banner if is_profile_complete is false

- onComplete: this section is always "complete" if season is selected
  (profile completeness is handled separately)

---

SECTION 2 — Contact & HR Details:
Create src/components/forms/jnf/sections/ContactDetailsSection.tsx

Props same pattern as Section 1 but saves to 'contacts' section.

interface ContactForm:
  head_hr: ContactPerson
  poc_1: ContactPerson
  poc_2: Partial<ContactPerson>

interface ContactPerson:
  full_name: string
  designation: string
  email: string
  mobile: string
  alt_mobile?: string
  landline?: string

UI: Three MUI Cards side by side (stack on mobile):

Card 1 — "Head HR" (chip: REQUIRED):
1. Full Name* — TextField, max 255, char counter
2. Designation* — TextField, max 255, char counter
3. Email Address* — TextField, email validation
4. Mobile Number* — TextField with +91 InputAdornment, 10 digits, regex
5. Alternative Mobile — TextField optional
6. Landline — TextField optional, format: STD code + number

Card 2 — "Primary Contact (PoC 1)" (chip: REQUIRED):
Same 6 fields
"Copy from Head HR" button at top of card — fills all fields from Card 1

Card 3 — "Secondary Contact (PoC 2)" (chip: OPTIONAL):
Same 6 fields but none required
Entire card can be collapsed/expanded with a toggle

Validation: All required fields must be filled for section to be "complete"
Save: calls onSave('contacts', { head_hr, poc_1, poc_2 })
onComplete(true) when head_hr + poc_1 all required fields are filled

All .tsx, no any types.
```

---

### PROMPT 19 — JNF Section 3: Job Profile

```
Context: IIT ISM CDC Portal. Building JNF Section 3 — the Job Profile section. This section captures all details about the job role being offered.

Task: Create src/components/forms/jnf/sections/JobProfileSection.tsx

Props:
  jnfId: number
  onSave: (section: string, data: object) => Promise<void>
  onComplete: (isComplete: boolean) => void
  defaultValues?: Partial<JnfJobProfile>

Use react-hook-form. All fields use Controller with proper typing.

Fields to build:

BASIC DETAILS GROUP (MUI Card — "Job Details"):

1. Profile Name / Job Title* (required)
   - TextField, max 255, char counter
   - Placeholder: "e.g. Software Development Engineer"

2. Job Designation (formal title)
   - TextField, max 255
   - Helper text: "Formal designation as per offer letter (may differ from job title)"
   - Placeholder: "e.g. Engineer Grade-1"

3. Place of Posting* (required)
   - TextField, max 500
   - Placeholder: "e.g. Bangalore, Mumbai (Multiple locations)"

4. Work Location Mode* (required)
   - MUI ToggleButtonGroup (exclusive selection)
   - Options: "On-site" | "Remote" | "Hybrid"
   - Use WorkIcon, HomeIcon, DevicesIcon from MUI icons

5. Tentative Joining Month* (required)
   - MUI DatePicker (month and year only, not day)
   - Use @mui/x-date-pickers MonthPicker or DatePicker with views={['month', 'year']}
   - Min: current month

6. Expected Hires* (required)
   - TextField type="number", min 1
   - Width: 50% of row

7. Minimum Hires (optional)
   - TextField type="number", min 1, max = expected_hires
   - Width: 50% of row
   - Helper: "Minimum acceptable number of hires"

SKILLS GROUP (MUI Card — "Required Skills"):
8. Skills Tag Input
   - TextField where typing and pressing Enter or comma adds a chip
   - Show added skills as deletable MUI Chips below the input
   - Max 20 skills
   - Placeholder: "Type a skill and press Enter (e.g. Python, React, SQL)"

JOB DESCRIPTION GROUP (MUI Card — "Job Description"):
9. Job Description (rich text editor)
   - Install and use react-quill
   - Full toolbar: bold, italic, underline, ordered list, unordered list, heading
   - Placeholder: "Describe the role, responsibilities, and requirements..."
   - OR: alternative "Upload JD as PDF" toggle
   
10. Upload JD as PDF (toggle alternative to rich text)
    - MUI Switch: "Upload PDF instead of writing"
    - When ON: show file upload area (drag & drop or click)
    - Accept: application/pdf only, max 10MB
    - Show file name + size after upload

ADDITIONAL DETAILS GROUP (MUI Card — "Additional Information"):
11. PPO Provision on Performance (for INF forms primarily but also JNF)
    - MUI Switch with label "Pre-Placement Offer (PPO) provision based on performance"

12. Registration Link (optional)
    - TextField, URL validation
    - Helper: "Company's own application link (if separate from CDC portal)"

13. Additional Job Info (optional)
    - TextField multiline, max 1000 chars with char counter
    - Helper: "Any other information about the role"

14. Bond Details (optional)
    - TextField multiline
    - Placeholder: "e.g. 2-year service bond with ₹2L penalty"

15. Onboarding Procedure (optional)
    - TextField multiline
    - Placeholder: "Describe the onboarding process if any"

Completion check: required fields (job_title, place_of_posting, work_mode, tentative_joining, expected_hires) all filled → onComplete(true)

Auto-save on any change after 30 seconds of inactivity (debounce).
Save: calls onSave('job_profile', formData)

All .tsx, typed, responsive, no any.
```

---

### PROMPT 20 — JNF Section 4: Eligibility & Courses

```
Context: IIT ISM CDC Portal. Building JNF Section 4 — Eligibility & Courses. This is the most complex section — it uses data from our departments.csv, branches.csv, and courses.csv files.

Task: Create src/components/forms/jnf/sections/EligibilitySection.tsx

Props:
  jnfId: number
  onSave: (section: string, data: object) => Promise<void>
  onComplete: (isComplete: boolean) => void
  defaultValues?: Partial<JnfEligibility>

Use constants from src/lib/constants.ts: COURSES, BRANCHES, DEPARTMENTS

SECTION STRUCTURE:

PART A — Programme Selection (MUI Card "Select Eligible Programmes"):

Show courses grouped into logical groups with GROUP HEADERS:

Group 1: "UG Programmes (JEE Advanced)"
  - b.tech (Bachelor of Technology — 4 years)
  - be (Bachelor of Engineering — 4 years)
  - dualdegree (Dual Degree — 5 years)
  - dualdegree_categoryA, B, C, C1, C2, D
  - dd.b.tech (Dual Degree B.Tech with MBA — 5 years)
  - int.bsms (Integrated B.Sc + M.Sc — 5 years)

Group 2: "Integrated Programmes"
  - int.m.sc (Integrated M.Sc — 5 years)
  - int.m.tech (Integrated M.Tech — 5 years)
  - int.msc.tech (Integrated M.Sc.Tech — 5 years)

Group 3: "PG Programmes (GATE/JAM/CAT)"
  - m.tech (M.Tech — 2 years)
  - 3yrmtech (M.Tech 3 years)
  - m.sc (M.Sc — 2 years)
  - m.sc.tech (M.Sc.Tech — 3 years)
  - mba (MBA — 2 years)
  - mbaba (MBA Business Analytics — 2 years)
  - ma (M.A. — 2 years)
  - pgd (PG Diploma — 2 years)

Group 4: "Executive Programmes"
  - execmba (Executive MBA — 3 years)
  - 2execmtech (Executive M.Tech 2yr)
  - 3execmtech (Executive M.Tech 3yr)

Group 5: "Research Programmes"
  - jrf (Ph.D — 7 years)

For EACH group: "Select All" checkbox at top (like IIT Delhi)
For EACH selected course: show an expandable sub-section with branch checkboxes
Branch checkboxes: show ALL active branches from BRANCHES constant
The branch sub-section also has "Select All Branches" checkbox

UI rendering tip: use MUI Accordion for each course group, with checkboxes in the AccordionDetails.

PART B — Eligibility Criteria (MUI Card "Eligibility Requirements"):

1. Minimum CGPA (overall)
   - TextField type="number", step 0.1, min 0, max 10
   - Width 200px
   - Label: "Minimum CGPA / CPI"

2. Per-Discipline CGPA (shows only if multiple branches selected)
   - MUI Table with columns: Branch | Min CGPA
   - Auto-populated with selected branches
   - Each CGPA cell is editable TextField

3. Backlogs Allowed?
   - MUI RadioGroup: "Yes" | "No"
   - Default: No

4. High School % Criterion (optional)
   - TextField type="number", label "Min. 10+2 Percentage"
   - 0-100, step 0.01

5. Gender Filter
   - MUI RadioGroup: "All Genders" | "Male Only" | "Female Only" | "Others Only"
   - Default: All Genders

6. Special Requirements related to SLP (optional)
   - TextField multiline, placeholder "Any special eligibility requirement..."
   - SLP = Special/Lateral Programme — note this with helper text

Completion: At least one course + one branch must be selected → onComplete(true)
Save: calls onSave('eligibility', formData)

All .tsx, typed with full interfaces for the programmes data structure.
No any types anywhere.
```

---

### PROMPT 21 — JNF Section 5: Salary Details

```
Context: IIT ISM CDC Portal. Building JNF Section 5 — Salary Details. This section captures the full CTC (Cost to Company) breakdown for each eligible programme.

Task: Create src/components/forms/jnf/sections/SalarySection.tsx

Props:
  jnfId: number
  onSave: (section: string, data: object) => Promise<void>
  onComplete: (isComplete: boolean) => void
  defaultValues?: Partial<JnfSalary>
  selectedCourses?: string[]  — from eligibility section, to show only relevant rows

SECTION STRUCTURE:

TOP CONTROLS (sticky row at top of card):

1. Currency Selector
   - MUI ToggleButtonGroup (exclusive): INR | USD | EUR
   - Shows currency symbol in table headers

2. "Same structure for all programmes" Toggle
   - MUI Switch
   - When ON: single salary grid applies to all courses
   - When OFF: separate accordion per course with its own grid

---

SALARY TABLE (when "Same for all" is ON):
MUI Table with these columns:

| Programme | CTC (Annual) | Base / Fixed | Monthly Take-home | UG CTC | PG CTC |

Rows: One row per selected course (from eligibility section)
If no courses selected yet: show all main courses as rows
  - B.Tech / Dual Degree / Int. M.Tech (UG group)
  - M.Tech / 3yr M.Tech
  - MBA / MBA (BA)
  - M.Sc / M.Sc.Tech
  - Ph.D
  - M.A. / PG Diploma

Each cell is an editable TextField type="number" with min=0
Show the currency symbol as InputAdornment prefix (₹ for INR, $ for USD, € for EUR)

---

SALARY SECTION (when "Different per programme" is OFF):
Show MUI Accordions — one per course group:
Each accordion header: course name + "expand to edit"
Each accordion content: the table above but for just that course

---

ADDITIONAL COMPONENTS (MUI Card "Additional Salary Components"):

"Same for all programmes" Switch at top of this card too.

Standard components to always show:
1. Joining Bonus — TextField number + optional "One-time" label
2. Retention Bonus — TextField number
3. Variable / Performance Bonus — TextField text (e.g. "Up to 20% of CTC")
4. ESOPs — TextField text + "Vesting period:" TextField
5. Relocation Allowance — TextField number
6. Medical Allowance — TextField number
7. Deductions (mention any) — TextField text
8. Bond Amount — TextField number + "Duration:" TextField text
9. First Year CTC — TextField number (sometimes different from regular CTC)
10. Gross Salary per annum — TextField number
11. CTC Breakup — TextField multiline text (free form breakdown)

"+ Add Custom Component" Button:
- Adds a new row with: Component Name (TextField) + Value (TextField) + Remove button

Completion: At least one salary row with CTC annual filled → onComplete(true)
Save: calls onSave('salary', formData)

All .tsx, typed. No any types.
```

---

### PROMPT 22 — JNF Section 6: Selection Process

```
Context: IIT ISM CDC Portal. Building JNF Section 6 — Selection Process. This section captures the full interview and selection process details.

Task: Create src/components/forms/jnf/sections/SelectionProcessSection.tsx

Props:
  jnfId: number
  onSave: (section: string, data: object) => Promise<void>
  onComplete: (isComplete: boolean) => void
  defaultValues?: Partial<JnfSelectionProcess>

SECTION STRUCTURE:

PART A — Default Selection Stages (MUI Card "Selection Stages"):

Show 5 default stages as togglable rows (like a checklist):
Each stage row has:
- Left: MUI Checkbox to enable/disable this stage
- Stage name (bold)
- When enabled: expand to show configuration fields inline

DEFAULT STAGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stage 1: Pre-Placement Talk (PPT)
  When enabled:
  - Mode: Online / Offline / Hybrid (ToggleButtonGroup)
  - Duration: TextField number "minutes"

Stage 2: Resume Shortlisting
  When enabled:
  - Mode: Online / Offline / Hybrid
  - No other fields

Stage 3: Online / Written Test
  When enabled:
  - Mode: Online / Offline / Hybrid
  - Test Type: MUI Select — "Aptitude" | "Technical" | "Written" | "Aptitude + Technical"
  - Duration: TextField number "minutes"
  - "Add another test round" button (max 10 rounds total)
    Each additional round gets the same Mode + Test Type + Duration fields

Stage 4: Group Discussion
  When enabled:
  - Mode: Online / Offline / Hybrid
  - Duration: TextField number "minutes"

Stage 5: Personal / Technical Interview
  When enabled:
  - Mode: Online / Offline / Hybrid
  - Interview Mode: MUI Select — "On-campus" | "Telephonic" | "Video Conferencing"
  - Duration: TextField number "minutes"
  - "Add another interview round" button (max 10 rounds total)
    Each round: Mode + Interview Mode + Duration + optional "Round Name" TextField

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART B — Infrastructure Requirements (MUI Card "Campus Infrastructure"):
- TextField multiline: "Team size visiting campus" (number people)
- TextField: "Number of rooms/labs required"
- TextField multiline: "Special infrastructure requirements"

PART C — Additional Screening (MUI Card "Additional Screening"):
Three MUI Switches:
1. "Psychometric Test required before final offer"
   - If ON: show TextField "Details about the psychometric test"

2. "Medical Test required before final offer"
   - If ON: show TextField "Medical standards/requirements"

3. "Other screening method"
   - If ON: show TextField "Describe the screening method"

Completion: At least one stage enabled → onComplete(true)
Save: calls onSave('selection_process', formData)

All .tsx, typed with SelectionStage interface. No any types.
```

---

### PROMPT 23 — JNF Section 7: Declaration & Submit

```
Context: IIT ISM CDC Portal. Building the final JNF section — Declaration and Submit.

Task: Create src/components/forms/jnf/sections/DeclarationSection.tsx and complete the form submission flow.

Props:
  jnfId: number
  onSave: (section: string, data: object) => Promise<void>
  onComplete: (isComplete: boolean) => void
  onSubmit: () => Promise<void>
  defaultValues?: Partial<JnfDeclaration>
  allSectionsComplete: boolean  — true only when all 6 previous sections are complete

SECTION STRUCTURE:

PART A — AIPC Declaration (MUI Card "Declaration"):
Heading: "Please read and agree to the following declarations:"

Five mandatory MUI Checkboxes (all must be checked to enable Submit):

☐ I/We have thoroughly read the AIPC guidelines and agree to abide by them during the 
   entire placement/internship process. [View AIPC Guidelines →] (external link)

☐ I/We agree to provide shortlisting criteria and shall provide the final shortlist to CDC 
   within 24-48 hours after the online/written test.

☐ I/We confirm that all information in this profile is verified and correct. No new clauses 
   shall be added to the final offer letter beyond what is declared here.

☐ I/We consent to share the company name, logo, and email with national ranking agencies, 
   RTI applicants, and media as per IIT (ISM) policy.

☐ I/We confirm the accuracy of this job profile and agree to adhere to the T&C of IIT (ISM) 
   CDC. I/We understand that strict action will be taken in case of any discrepancy.

Additional:
☐ I/We consent to share data with RTI/NIRF ranking agencies. [IIT ISM RTI Policy →]

---

PART B — Authorised Signatory (MUI Card "Authorised Signatory"):

1. Full Name of Authorised Signatory*
   - TextField, max 255

2. Designation of Signatory*
   - TextField, max 255

3. Date*
   - MUI DatePicker, default to today, max = today

4. Typed Signature*
   - TextField with font-family: 'Pacifico', cursive (or Dancing Script)
   - Import the font via @import in a <style> tag
   - Show a live preview below the field showing what they typed in the cursive font
   - Label: "Type your full name as signature"

---

PART C — Preview Before Submit (MUI Card "Review Your Form"):
- "Preview Complete Form" Button (outlined)
- On click: open MUI Dialog (fullScreen on mobile, large on desktop)
- Dialog shows ALL 7 sections of the form in a clean read-only layout
- Each section has an "Edit" IconButton that closes the preview and jumps to that section
- Scrollable dialog content with Table of Contents at top

---

PART D — Submit:
- Submit button: "Submit JNF Form" (large, contained primary, full width)
- Disabled if: not all 6 checkboxes checked, or allSectionsComplete is false
- If allSectionsComplete is false: show banner "⚠️ Some sections are incomplete. Please complete all sections before submitting."
- On click: show MUI Dialog "Confirm Submission" with warning: "Once submitted, you cannot edit this form unless CDC requests changes."
- On confirm: call onSubmit() which triggers the submit API

BACKEND (Laravel) — JnfController.submit($id):
- Validate: all required sections must have data (check existence of child records)
- Update form status: 'submitted'
- Set submitted_at: now()
- Create FormAuditLog: { action: 'submitted', performed_by: auth()->id() }
- Send FormSubmittedConfirmation email to company
- Create Notification for admin user
- Send AdminFormSubmittedAlert email to admin@iitism.ac.in
- Return: { success: true, message: "JNF submitted successfully!" }

On success in frontend: show success toast, redirect to /dashboard
All .tsx, typed, no any.
```

---

### PROMPT 24 — INF Form (Internship Notification Form)

```
Context: IIT ISM CDC Portal. The JNF (Job Notification Form) is complete. Now build the INF (Intern Notification Form). It is nearly identical to JNF with one key difference: Section 5 is "Stipend Details" instead of "Salary Details."

Task: Build the INF form by reusing JNF components and creating only the different section.

1. Create src/app/(company)/inf/new/page.tsx:
   - On mount: call POST /api/inf to create draft
   - Render INF form shell — almost identical to JNF but with title "INF — Intern Notification Form"

2. Create src/components/forms/inf/InfFormShell.tsx:
   - Copy the structure of JnfFormShell.tsx
   - Change step 5 from "Salary Details" to "Stipend Details"
   - Pass formType="INF" to all child components

3. REUSE these sections exactly from JNF (just pass them with jnfId pointing to an INF record):
   - Section 1: CompanyProfileSection (identical)
   - Section 2: ContactDetailsSection (identical)
   - Section 3: JobProfileSection (identical — but label change: "Internship Profile" instead of "Job Profile")
   - Section 4: EligibilitySection (identical)
   - Section 6: SelectionProcessSection (identical)
   - Section 7: DeclarationSection (identical)

4. Create ONLY the different section:
   src/components/forms/inf/sections/StipendSection.tsx (instead of SalarySection)

   Props: same pattern as SalarySection

   Stipend Table (MUI Table):
   Columns: | Programme | Base Stipend (Monthly) | HRA / Housing Allow. | Variable / Performance Pay | Other | Total (auto-calculated) |
   
   Rows: One per selected course from eligibility:
   - B.Tech / Dual Degree (UG group)
   - M.Tech (PG group)  
   - MBA / MBA (BA)
   - M.Sc / M.Sc.Tech
   - Ph.D
   
   Total column: auto-calculated = Base + HRA + Variable + Other (computed in real-time)
   
   Currency selector: INR / USD / EUR (same as salary)
   
   Additional Perks (MUI Accordion per programme):
   - Accommodation (Yes/No toggle + details TextField)
   - Travel Allowance (Yes/No + amount)
   - Food/Meal Allowance (Yes/No + amount)
   - Any other perks (TextField)

   PPO Note: Show info banner: "If PPO provision was selected in Job Profile section, eligible interns may receive a Pre-Placement Offer based on performance."

5. BACKEND (Laravel):
   Create app/Http/Controllers/Api/Company/InfController.php:
   - Identical to JnfController but creates records with form_type = 'INF'
   - Routes: POST /api/inf, GET /api/inf/{id}, PUT /api/inf/{id}/draft, POST /api/inf/{id}/submit

All .tsx, typed, reuse as much as possible from JNF components.
```

---

## ✅ PHASE 3 CHECKPOINT — Run This After Prompt 24

```
Verify ALL of the following before proceeding to Phase 4:

□ JNF form creates a draft on /jnf/new page load (check DB)
□ Section 1 (Company Profile): shows real company data, season selector works
□ Section 2 (Contacts): all 3 contact cards save correctly, "Copy from Head HR" works
□ Section 3 (Job Profile): rich text JD works, skills tags work, PDF upload works
□ Section 4 (Eligibility): programme groups render with all courses and branches from CSV,
   "Select All" checkboxes work per group
□ Section 5 (Salary): currency toggle works, same/different per programme toggle works,
   custom component add/remove works
□ Section 6 (Selection): all 5 stages toggle, add rounds up to 10 works
□ Section 7 (Declaration): all 6 checkboxes must be checked, preview modal opens with all data,
   submit button is disabled until all sections complete
□ Form submission: status changes to 'submitted' in DB, emails sent, redirects to dashboard
□ INF form: loads correctly, stipend section shows different columns, total auto-calculates
□ Auto-save: fires every 30 seconds, shows "Saved at HH:MM" indicator
□ All form steps show completion checkmarks when required fields are filled
□ All files are .tsx (run: find src -name "*.js" to verify zero .js files)

If any check fails, fix it before continuing.
```

---

# PHASE 4 — Admin Portal (Prompts 25–32)

---

### PROMPT 25 — Admin Layout and Dashboard (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Building the admin portal for CDC staff. Admin has separate routes at /admin/*.

Task: Build the admin layout and dashboard.

BACKEND (Laravel):

Create app/Http/Controllers/Api/Admin/AdminDashboardController.php:
Method: stats()
Route: GET /api/admin/dashboard (auth:sanctum + role:admin middleware)

Return data:
{
  stats: {
    total_companies: count of all companies,
    new_this_week: companies registered in last 7 days,
    total_jnf: count of JNF forms,
    total_inf: count of INF forms,
    jnf_by_status: { draft, submitted, under_review, approved, rejected } counts,
    inf_by_status: same,
    pending_review: submitted + under_review total,
  },
  recent_submissions: [last 10 submissions with company name, form type, status, submitted_at]
  recent_companies: [last 5 registered companies]
}

FRONTEND (Next.js):

1. Create src/app/(admin)/admin/layout.tsx:
This is the admin app shell. All /admin/* pages render inside this.

Left Sidebar (permanent on desktop, drawer on mobile):
- Top: "IIT ISM CDC" text + "Admin Panel" badge (red chip)
- Nav items with MUI List:
  * Dashboard (DashboardIcon)
  * Companies (BusinessIcon)
  * JNF Submissions (WorkIcon)  
  * INF Submissions (SchoolIcon)
  * Notifications (NotificationsIcon) — show unread count badge
  * Settings (SettingsIcon)
- Bottom of sidebar: logged-in admin name + Logout button

Top AppBar:
- Hamburger menu button (mobile only)
- "Career Development Centre | IIT (ISM) Dhanbad" title
- Right side: Notification bell (with badge count), Admin name, Logout

2. Create src/app/(admin)/admin/dashboard/page.tsx:

Server component: checks session → admin role → render AdminDashboardClient

Create src/app/(admin)/admin/dashboard/AdminDashboardClient.tsx:

LAYOUT:
Row 1 — Stats Cards (6 cards in a responsive grid):
- Total Companies (blue, BusinessIcon)
- New This Week (teal, TrendingUpIcon)
- Pending Review (amber, HourglassEmptyIcon) — clickable → /admin/submissions?status=pending
- Approved Forms (green, CheckCircleIcon)
- JNFs Total (primary, WorkIcon)
- INFs Total (secondary, SchoolIcon)

Row 2 — Two columns:
LEFT (60%): "Recent Submissions" — MUI Table with:
  Columns: Company, Type, Job Title, Submitted, Status
  Last 10 entries, each row clickable → /admin/submissions/[id]
  "View All Submissions →" link below

RIGHT (40%): "Recently Registered Companies" — MUI List with:
  Avatar (company logo or initials), Company Name, Sector, Registered date
  "View All Companies →" link

Row 3 — Status Distribution Charts:
  Two side-by-side MUI LinearProgress bars (simple visual):
  JNF Status: Approved vs Pending vs Rejected
  INF Status: same

All .tsx. Route protected server-side (redirect to /login if not admin).
```

---

### PROMPT 26 — Admin Companies List (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Admin can view and manage all registered companies.

Task: Build the admin companies management page.

BACKEND (Laravel):

Create app/Http/Controllers/Api/Admin/CompanyController.php:

index(Request $request): GET /api/admin/companies
- Auth: admin only
- Filters: ?search=string (name, email, sector), ?status=active|suspended, ?sector=string
- Paginate: 20 per page
- Each company: id, company_name, sector, org_type, no_of_employees, 
  user (name, email, created_at, is_active), total_forms count
- Return: PaginatedResponse<Company>

show($id): GET /api/admin/companies/{id}
- Return full company with: user, contacts (all 3), all forms (with job profiles), audit logs

toggleStatus($id): PUT /api/admin/companies/{id}/toggle-status
- Flip user.is_active between true and false
- If suspending: revoke all Sanctum tokens for that user
- Log action in form_audit_log (reuse for company actions, note: set jnf_id to null and add company_id column if not present, OR create separate company_audit_log if preferred)
- Return: { success: true, data: { is_active: new_status } }

FRONTEND (Next.js):

Create src/app/(admin)/admin/companies/page.tsx (server component → renders client)
Create src/app/(admin)/admin/companies/CompaniesClient.tsx

LAYOUT:
Top bar:
- "Companies" heading
- Search TextField (searches name, email, sector in real-time with 300ms debounce)
- Filter chips: "All" | "Active" | "Suspended" | [Sector filter dropdown]
- Export CSV button (downloads company list as CSV)

Companies Table (MUI DataGrid with these columns):
| Company Name | Sector | Org Type | Registered | Contact Email | Status | Actions |

Company Name column: shows logo thumbnail + name (clickable → detail drawer)
Status column: "Active" (green chip) or "Suspended" (red chip)
Actions column: 
  - View Detail (VisibilityIcon button)
  - Suspend / Activate (toggle, show confirmation dialog before suspending)

When a row is clicked OR "View Detail" is clicked:
Open a MUI Drawer from the right (600px wide):
Drawer contents:
- Company name, logo, org type, sector as header
- Tabs: "Profile" | "Contacts" | "Submissions" | "Activity Log"

Profile tab: all company fields in a clean two-column layout
Contacts tab: three contact cards (Head HR, PoC 1, PoC 2)
Submissions tab: table of all JNF/INF forms with status and link to review
Activity log tab: list of actions taken on this company (registration, suspension, etc.)

All .tsx, typed, uses PaginatedResponse from types.
```

---

### PROMPT 27 — Admin Submissions List (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Admin needs to see and filter all JNF/INF submissions.

Task: Build the admin submissions management page.

BACKEND (Laravel):

Create app/Http/Controllers/Api/Admin/SubmissionController.php:

index(Request $request): GET /api/admin/submissions
- Auth: admin only
- Filters:
  * type: 'JNF' | 'INF' | 'all' (default all)
  * status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'all'
  * season: string (e.g. '2024-25')
  * search: searches company name and job title
  * date_from, date_to: filter by submitted_at date range
- Paginate: 20 per page
- Each record includes: id, form_type, status, season, submitted_at,
  company (name, logo_path), jobProfile (job_title), reviewedBy (name)
- Return: PaginatedResponse<JnfForm>

bulkAction(Request $request): POST /api/admin/submissions/bulk
- Auth: admin only
- Accepts: { ids: number[], action: 'approve' | 'reject' | 'set_under_review', comment?: string }
- Loop: for each id, perform the action
- Each action: update status, create audit log, send appropriate email
- Return: { success: true, message: "X forms updated successfully" }

FRONTEND (Next.js):

Create src/app/(admin)/admin/submissions/page.tsx (server → client)
Create src/app/(admin)/admin/submissions/SubmissionsClient.tsx

LAYOUT:
Top section:
- "Submissions" heading + "JNF" | "INF" | "All" tab switcher
- Filter row:
  * Search TextField
  * Status filter MUI Select: All | Submitted | Under Review | Approved | Rejected
  * Season filter MUI Select: All | 2024-25 | 2025-26 | 2026-27
  * Date range: From DatePicker | To DatePicker
  * "Clear Filters" button

Bulk Actions bar (shows when rows are selected):
- "X items selected" text
- "Set to Under Review" button
- "Approve Selected" button (green)
- "Reject Selected" button (red) → opens dialog asking for rejection reason

MUI DataGrid (columns):
| ☐ | Company | Type | Job Title | Season | Submitted Date | Status | Reviewed By | Actions |

Company column: logo + name
Type column: "JNF" or "INF" chip
Status column: color-coded chip using STATUS_CONFIG
Actions column:
- Review (OpenInNew icon) → /admin/submissions/[id]
- Download PDF (PictureAsPdf icon)

Click row → navigate to review page: /admin/submissions/[id]

Empty state: illustration + "No submissions found matching your filters"

All .tsx, typed, responsive.
```

---

### PROMPT 28 — Admin Form Review Page (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Admin needs to review individual JNF/INF submissions in detail and take action.

Task: Build the individual submission review page.

BACKEND (Laravel):

Add to SubmissionController:

show($id): GET /api/admin/submissions/{id}
- Load full form with ALL relations
- Return complete JnfForm object with company, contacts, jobProfile, eligibility, salary, selectionProcess, declaration, auditLog (ordered by created_at desc)

updateStatus($id, Request $request): PUT /api/admin/submissions/{id}/status
- Auth: admin only
- Accepts: { action: 'under_review' | 'approve' | 'reject' | 'request_changes', reason?: string, internal_note?: string }
- Update form status accordingly
- Set reviewed_by: auth()->id(), reviewed_at: now()
- Add rejection_reason if rejecting
- Save internal_note to admin_notes field (never exposed to company)
- Create FormAuditLog entry
- Fire appropriate email event:
  * approve → FormApprovedEmail to company
  * reject → FormRejectedEmail to company (with reason)
  * request_changes → FormChangesRequestedEmail to company (with reason)
- Return: { success: true, data: updated form }

FRONTEND (Next.js):

Create src/app/(admin)/admin/submissions/[id]/page.tsx
Create src/app/(admin)/admin/submissions/[id]/ReviewPageClient.tsx

LAYOUT — Two-panel split:

LEFT PANEL (65% width):
"Form Preview" — shows the complete JNF/INF form read-only

Header: Company logo + name | Form type badge | Status chip | Submitted date
Tab bar: All Sections | Company Profile | Job Profile | Eligibility | Salary | Selection | Declaration

For each section: render a clean read-only view of all data
- Use MUI Paper cards for each section
- Show field labels in grey, values in dark text
- Lists render as chips (skills, industry tags)
- Salary shows as a formatted table
- Selection stages show as a timeline

Edit mode (toggle per section):
"Edit" icon button in each section header
When clicked: that section becomes editable inline (renders the same form components as company-facing, but admin can edit any field)
"Save Changes" and "Cancel" buttons appear
On save: calls PUT /api/admin/submissions/{id}/sections/{section} with edited data
Logs the change in form_audit_log

RIGHT PANEL (35% width, sticky):
"Review Actions" card:

1. Current Status: large badge with icon

2. Status Timeline (vertical, showing all state changes):
   Draft → Submitted → Under Review → Approved/Rejected
   Each step shows: date/time + who performed the action

3. Action Buttons (depends on current status):

If status === 'submitted':
  - "Start Review" button (sets status to under_review)

If status === 'under_review':
  - "Request Changes" button (opens dialog with comment TextField)
  - "Approve Form" button (green, confirms before acting)
  - "Reject Form" button (red, requires: rejection reason dropdown + details TextField)

Rejection reason dropdown options:
  "Incomplete information", "Salary not as per CDC norms", "Duplicate submission",
  "Company not eligible", "Policy violation", "Other (specify below)"

4. Internal Notes (never shown to company):
   TextField multiline labeled "Internal CDC Notes (not visible to company)"
   "Save Note" button

5. Audit Log (last 5 entries):
   Each: action name, performed by, date/time
   "View full log" link

6. Download PDF button (generates and downloads form PDF)

All .tsx, typed, no any.
```

---

### PROMPT 29 — Admin Email Templates and Notification Actions (Laravel)

```
Context: IIT ISM CDC Portal. Admin review actions need to trigger appropriate emails to companies. Building all remaining email templates and the notification system.

Task: Create all remaining Laravel email classes and templates.

1. app/Mail/FormSubmittedConfirmation.php — to company on form submit:
   Constructor: $form (JobNotificationForm with company)
   Subject: "[IIT ISM CDC] {form_type} Submission Confirmed — {job_title}"
   Template: emails/form_submitted.blade.php
   Content:
   - "Your {JNF/INF} has been submitted successfully"
   - Submission details: Form ID (#{id}), Company, Job Title, Season, Submitted At
   - "Your submission is now under review by the CDC team. You will be notified of any updates."
   - Submission ID prominently displayed (for reference)

2. app/Mail/AdminFormSubmittedAlert.php — to admin on company submission:
   Subject: "[CDC Alert] New {form_type} Submitted: {company_name} — {job_title}"
   Template: emails/admin_form_submitted.blade.php
   Content: company details, job title, salary CTC summary, "Review Now" button

3. app/Mail/FormApprovedEmail.php — to company on approval:
   Subject: "[IIT ISM CDC] ✓ Your {form_type} Has Been Approved!"
   Template: emails/form_approved.blade.php
   Content:
   - Congratulations message with checkmark icon
   - Approved form details (job title, season, approval date)
   - "What happens next?" section:
     1. CDC team will schedule your recruitment dates
     2. You will receive the shortlist from us
     3. Conduct interviews as per the agreed process
   - Contact CDC section: cdc@iitism.ac.in | +91-326-2235000

4. app/Mail/FormRejectedEmail.php — to company on rejection:
   Subject: "[IIT ISM CDC] Your {form_type} Requires Attention"
   Template: emails/form_rejected.blade.php
   Content:
   - "Your submission was not approved" (no harsh language)
   - Rejection reason: displayed prominently in a highlighted box
   - "You may revise and resubmit your form" instruction
   - "Revise Form" button linking to the form

5. app/Mail/FormChangesRequestedEmail.php — to company when admin requests changes:
   Subject: "[IIT ISM CDC] Changes Requested for Your {form_type}"
   Template: emails/form_changes_requested.blade.php
   Content:
   - "The CDC team has reviewed your submission and requires some changes"
   - Requested changes text in a highlighted box
   - "Edit and Resubmit" button

6. Create app/Notifications/AdminNotificationService.php (service class):
   createNotification($userId, $type, $title, $message, $data = []):
   - Inserts into notifications table
   - Used by all controllers when admin notification is needed

Call this service from:
- JnfController.submit(): notify admin of new JNF submission
- InfController.submit(): notify admin of new INF submission
- AuthController.register(): notify admin of new company

Routes for notification actions (already created, verify exist):
GET /api/admin/notifications
PUT /api/admin/notifications/{id}/read
PUT /api/admin/notifications/read-all
```

---

### PROMPT 30 — Admin Notifications Page + Settings Page (Next.js + Laravel)

```
Context: IIT ISM CDC Portal. Building the admin notifications center and settings.

Task: Build the notifications and settings pages.

BACKEND (Laravel):

Create app/Http/Controllers/Api/Admin/NotificationController.php:

index(): GET /api/admin/notifications
- Auth: admin only
- Return all notifications for admin user: unread first, then read
- Include: id, type, title, message, data, is_read, created_at
- Add unread_count in response header or meta

markRead($id): PUT /api/admin/notifications/{id}/read
- Set is_read = true
- Return { success: true }

markAllRead(): PUT /api/admin/notifications/read-all
- Set is_read = true for all admin notifications
- Return { success: true, updated: count }

Create app/Http/Controllers/Api/Admin/SettingsController.php:

getSeasons(): GET /api/admin/settings/seasons
Return list of recruitment seasons (can be DB-stored or config-based)

updateSeasons(Request $request): PUT /api/admin/settings/seasons
listAdmins(): GET /api/admin/settings/admins — list all admin users
inviteAdmin(Request $request): POST /api/admin/settings/admins/invite
deactivateAdmin($id): DELETE /api/admin/settings/admins/{id}

FRONTEND (Next.js):

1. Create src/app/(admin)/admin/notifications/page.tsx:

Layout:
- "Notifications" heading + "Mark All as Read" button
- Filter tabs: "All" | "Unread" | "Company Registrations" | "Form Submissions"

Notification list (MUI List):
Each notification item:
- Icon based on type (PersonAddIcon for registration, WorkIcon for form)
- Bold title + message preview
- Timestamp (relative: "2 hours ago")
- "Mark as Read" on hover (VisibilityIcon)
- Unread items: light blue background (#e3f2fd)
- Click → navigate to relevant page (company detail or form review)

Empty state: "All caught up! No notifications."

Polling: fetch /api/admin/notifications every 60 seconds to check for new ones

2. Notification bell in admin layout (update layout from Prompt 25):
- Fetch unread count on mount and every 60 seconds
- Show MUI Badge on NotificationsIcon with count
- On click: open MUI Popover showing last 5 notifications + "View All" link

3. Create src/app/(admin)/admin/settings/page.tsx:

Tabs: "Recruitment Seasons" | "Admin Users" | "Email Configuration"

Recruitment Seasons tab:
- MUI DataGrid: Season | Status | Actions
- "Add New Season" button: dialog with TextField
- Toggle season active/inactive

Admin Users tab:
- MUI DataGrid: Name | Email | Status | Last Login | Actions
- "Invite New Admin" button: dialog with email input
  → sends invitation email to new admin
- Deactivate button per row (with confirmation)

All .tsx, typed, responsive.
```

---

### PROMPT 31 — Company Form Resubmission + Admin Edit of Form Fields

```
Context: IIT ISM CDC Portal. Two features: (1) Company can revise and resubmit a rejected form. (2) Admin can edit any field in any submitted form.

Task: Build both features.

FEATURE 1 — Company Resubmission:

BACKEND (Laravel) — add to JnfController:
resubmit($id): POST /api/jnf/{id}/resubmit
- Auth: company owns this form
- Form status must be 'rejected' or changes_requested (add 'changes_requested' to status enum)
- Clone the form: create new job_notification_forms with same company_id, season, form_type
  but status='draft', version = old_version + 1, parent_form_id = old_id
- Clone all child records (job_profile, eligibility, salary, selection_process, declaration)
  for the new jnf_id
- Return: { success: true, data: { new_id: new form id } }

FRONTEND (Next.js):
Update src/app/(company)/dashboard/DashboardClient.tsx:

For each row with status 'rejected' or 'changes_requested':
- Show a "Changes Requested" or rejection reason in an expandable Alert below the table row
- Show "Revise & Resubmit" button (orange outlined button)
- On click: show confirmation dialog explaining that a new version will be created
- On confirm: call POST /api/jnf/{id}/resubmit → navigate to /jnf/[new_id] (edit mode)

Also show "Revision 2", "Revision 3" etc. badge on submissions that are revisions.

FEATURE 2 — Admin Inline Edit:

This extends the review page from Prompt 28.

BACKEND (Laravel) — add to SubmissionController:
updateSection($id, Request $request): PUT /api/admin/submissions/{id}/sections/{section}
- Auth: admin only
- Accepts: { data: object } — the updated section data
- section can be: job_profile, eligibility, salary, selection_process, contacts
- Update the corresponding child record
- Log in form_audit_log:
  { jnf_id, action: 'admin_edit', performed_by: admin_id, section_edited: section, old_data: previous data, note: request.edit_note }
- Return: { success: true, message: "Section updated by admin" }

FRONTEND (Next.js):
Update ReviewPageClient.tsx (from Prompt 28):

Add "Admin Edited" badge (amber chip) to any section that has been edited by admin.
(Check form_audit_log for 'admin_edit' actions for this section)

When admin clicks "Edit" on a section:
- Render the same form section component (e.g. JobProfileSection) but now it reads from the server data
- Admin can change any field
- "Save Changes" requires admin to fill a "Reason for edit" TextField (mandatory)
- On save: calls PUT /api/admin/submissions/{id}/sections/job_profile with { data, edit_note }
- Show success toast, refresh the section display

Show all admin edits in the audit log with: section name, admin name, timestamp, and old vs new values (if stored).
```

---

### PROMPT 32 — PDF Generation and Form Version History (Laravel + Next.js)

```
Context: IIT ISM CDC Portal. Building PDF generation for JNF/INF forms and version history view.

Task: Create professional PDF generation and version tracking.

BACKEND (Laravel):

1. Create PDF generation in JnfController:

generatePdf($id): GET /api/jnf/{id}/pdf (also /api/admin/submissions/{id}/pdf)
- Load form with all relations
- Use barryvdh/laravel-dompdf
- Render Blade view: resources/views/pdf/jnf_form.blade.php
- Return as inline PDF or force download based on ?download=true param
- Filename: "{form_type}_{company_name}_{season}_{form_id}.pdf"

2. Create resources/views/pdf/jnf_form.blade.php:
Professional A4 PDF layout:
- HEADER (navy background #1a237e):
  * Left: IIT (ISM) Dhanbad crest placeholder (use text "IIT (ISM) DHANBAD")
  * Center: "CAREER DEVELOPMENT CENTRE" (bold white)
  * Right: Form ID, Form Type (JNF/INF), Date
- Document title: "JOB NOTIFICATION FORM" (or INTERN NOTIFICATION FORM)
- Submission details box: Season, Status, Submitted On, Approved On (if applicable)

Then each section on the page:
SECTION 1 — Company Details: two-column table with all company fields
SECTION 2 — Contact Details: three contact person cards in a row
SECTION 3 — Job Profile: all fields in readable format
SECTION 4 — Eligibility: table of selected programmes + branches + CGPA criteria
SECTION 5 — Salary: formatted table with all CTC figures
SECTION 6 — Selection Process: list of stages with details
SECTION 7 — Declaration: checkboxes shown as ✓ or ☐, signatory details

FOOTER (each page): "IIT (ISM) Dhanbad | Career Development Centre | cdc@iitism.ac.in | Confidential"
Page numbers: "Page X of Y"

3. Add GET /api/jnf/{id}/versions: GET /api/admin/submissions/{id}/versions
- Return all versions of a form (using parent_form_id chain)
- Each version: { id, version, status, submitted_at, created_at }

FRONTEND (Next.js):

1. Update company dashboard: PDF download button calls /api/jnf/{id}/pdf?download=true
   Use: window.open(pdfUrl, '_blank')

2. Update admin review page: "Download PDF" button top right of review page

3. Create src/components/admin/VersionHistoryDialog.tsx:
- MUI Dialog showing all versions of a form
- Timeline component (MUI Timeline):
  Each point: Version number | Status | Submitted date | Submitted by
  Latest version highlighted
  Click any version to view it (opens in new tab via /admin/submissions/[id]?version=[n])

4. Add "View Version History" button to admin review page
   Shows count: "Version 2 of 3" with a history icon

All .tsx, typed. PDF must render correctly in the browser.
```

---

## ✅ PHASE 4 CHECKPOINT — Run This After Prompt 32

```
Verify ALL of the following before proceeding to Phase 5:

□ Admin dashboard loads with real stats (counts from DB)
□ Admin companies list: search/filter works, drawer opens with full company details
□ Suspend/activate company: user cannot login after suspension
□ Submissions list: type/status/season filters work, bulk selection works
□ Individual form review: all 7 sections display correctly
□ Admin can approve → company gets approval email → status changes to approved
□ Admin can reject with reason → company gets rejection email with reason
□ Admin can request changes → company gets email with feedback
□ Company can resubmit rejected form → new version created in DB
□ Admin can edit any section → edit logged in audit_log with admin name + timestamp
□ Admin notifications bell: shows unread count badge correctly
□ Notifications page: mark read / mark all read works
□ Settings page: seasons tab works
□ PDF generates and downloads with IIT ISM header and all form data
□ All admin routes redirect to /login if not admin (test in incognito)
□ All files are .tsx (verify zero .js/.jsx files in frontend)

If any check fails, fix it before continuing.
```

---

# PHASE 5 — Landing Page, UX Polish, and Role-Based Security (Prompts 33–40)

---

### PROMPT 33 — Public Landing Page

```
Context: IIT ISM CDC Portal. Building the public-facing landing page at the root URL. This is what companies see before they register.

Task: Build src/app/(public)/page.tsx — the landing page.

This page must be publicly accessible (no login required). It is fully responsive.

SECTIONS TO BUILD:

1. NAVBAR (sticky top, MUI AppBar):
   - Left: "IIT (ISM) Dhanbad" text in white (navy background)
   - Center: "Career Development Centre" subtitle
   - Right: "Login" (outlined white button) + "Register Company" (contained white/primary button)
   - On mobile: hamburger menu with the two buttons inside

2. HERO SECTION (full viewport height):
   - Background: deep navy gradient (#1a237e → #283593)
   - Heading: "Recruit India's Best Engineers" (white, very large, bold)
   - Subheading: "IIT (ISM) Dhanbad — 99+ Years of Excellence in Technical Education"
   - Two CTAs: "Register Your Company" (red contained) + "Learn More ↓" (outlined white)
   - HERO STATS BAR below (white cards on navy):
     * 500+ Companies | 95% Placement Rate | ₹48L Highest CTC | 32+ Departments

3. PLACEMENT STATS SECTION (white background):
   - Heading: "Placement Highlights"
   - 4 stat cards with animated counters (count up from 0 on scroll into view):
     * 500+ Companies (2024-25)
     * ₹48 Lakhs (Highest CTC)
     * 95% Placement Rate
     * 32+ Academic Departments
   - Use Intersection Observer API for scroll-triggered animation

4. WHY RECRUIT AT IIT (ISM) section (light grey #f5f5f5 background):
   - Heading: "Why Recruit at IIT (ISM) Dhanbad?"
   - 4 MUI Cards with icons:
     * 🏆 "99+ Year Legacy" — One of India's oldest technical institutes (est. 1926)
     * ⛏️ "Unique Specializations" — Unmatched talent in Mining, Energy, Petroleum & Geosciences
     * 🎓 "Diverse Programmes" — B.Tech to Ph.D across 17 active departments
     * 🌐 "Pan-India Network" — Alumni in top companies globally

5. HOW IT WORKS section (white background):
   - Heading: "How to Recruit from IIT (ISM)"
   - 4-step horizontal stepper:
     1. Register → 2. Submit JNF/INF → 3. CDC Reviews → 4. Conduct Recruitment

6. QUICK LINKS section:
   - "Download Placement Brochure" (button)
   - "View Past Recruiters" (button)
   - "Contact CDC" (button → scrolls to footer)

7. FOOTER (navy background):
   - Left: IIT ISM CDC name + address
   - Middle: Quick links (About, Contact, Policy)
   - Right: Contact details:
     * Email: cdc@iitism.ac.in
     * Phone: +91-326-2235000
     * Address: IIT (ISM), Dhanbad, Jharkhand — 826004
   - Copyright line

All .tsx. Responsive at all breakpoints. No any types.
```

---

### PROMPT 34 — Company Profile Edit Page + Form Completion Guard

```
Context: IIT ISM CDC Portal. Two UX features: profile editing and form submission guard.

Task:

1. Create src/app/(company)/profile/page.tsx — Company profile page:

Layout (MUI Tabs):
Tab 1: "Company Information"
Tab 2: "Contacts"
Tab 3: "Account Settings"

Tab 1 — Company Information:
Render all company fields in edit mode (same as registration Step 3 from Prompt 13)
Pre-fill all fields from current company data
"Update Profile" submit button
Calls PUT /api/company/profile with updated data
Show success toast on save

Backend: Add PUT /api/company/profile in a new CompanyProfileController
Validate all fields, update company record, set is_profile_complete based on required fields filled.

Tab 2 — Contacts:
Render all 3 contact cards (same as Section 2 contact form)
Each card has "Save" button
Calls PUT /api/company/contacts/{type} for each contact
Required contacts: Head HR and PoC 1

Tab 3 — Account Settings:
Change Password form:
- Current Password, New Password, Confirm New Password
- Same validation as registration
- Calls PUT /api/company/account/change-password

2. Add navbar link to company layout: "My Profile" links to /profile

3. FORM COMPLETION GUARD:
Update JnfFormShell and InfFormShell (from Prompt 17):

If company profile is_profile_complete === false when company tries to start a new JNF/INF:
- Show MUI Dialog (blocking, cannot dismiss):
  Heading: "Complete Your Company Profile First"
  Body: "Before submitting a JNF or INF, you need to complete your company profile with all required information."
  "Go to Profile" button → navigates to /profile
  (No cancel/close option — they must complete profile)

Add backend check in JnfController.create() and InfController.create():
- If company.is_profile_complete === false: return 403 with message

All .tsx, typed.
```

---

### PROMPT 35 — UX Improvements: Auto-Save, Unsaved Changes, and Toasts

```
Context: IIT ISM CDC Portal. Polishing the UX of the JNF/INF forms with important usability features.

Task: Implement these UX improvements across the form.

1. ENHANCED AUTO-SAVE INDICATOR:
Update the sticky bottom bar in JnfFormShell and InfFormShell:

States to show:
- "All changes saved" (green, CheckCircleOutlineIcon) — after successful save
- "Saving..." (grey, spinning CircularProgress) — during save API call
- "Unsaved changes" (amber, EditIcon) — when form is dirty and not yet saved
- "Save failed — retry?" (red, ErrorOutlineIcon) + "Retry" link — on save error

Auto-save interval: every 30 seconds if form is dirty
Also auto-save on tab change (when user clicks next step in the stepper)

2. UNSAVED CHANGES WARNING:
Add a browser unload warning:
In JnfFormShell, use useEffect to add event listener:
```
window.addEventListener('beforeunload', (e) => {
  if (formIsDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});
```
Also intercept Next.js router navigation:
If formIsDirty and user clicks sidebar nav or browser back button:
Show MUI Dialog: "You have unsaved changes. Are you sure you want to leave?"
Buttons: "Stay on Page" | "Leave Without Saving"

3. PROGRESS INDICATOR:
Add an overall form completion percentage to the top of the form shell:
- Calculate: (completed sections count / 7) * 100
- Show as MUI LinearProgress bar with label: "Form Completion: 57%"
- Each section contributes equally (14.28% each)

4. FIELD-LEVEL VALIDATION TIMING:
In all form sections, change validation trigger:
- Required fields: validate on blur (when user leaves the field)
- Format fields (email, mobile, URL): validate on change after first blur
- Do NOT show errors on initial render

5. STEP COMPLETION INDICATORS:
In the left sidebar stepper, each step shows:
- ✓ (green CheckCircle) if section is complete
- ● (blue) if section is active
- ○ (grey) if section is incomplete
- ⚠ (amber) if section was complete but is now invalid due to a field change

6. KEYBOARD NAVIGATION:
Add to all form sections:
- Tab moves between fields in logical order
- Shift+Tab moves backward
- Enter in the last field of a section triggers auto-save and focuses Next button
- Ctrl+S (Cmd+S on Mac) triggers manual save

7. TOAST NOTIFICATIONS:
Update all toast calls across the app to use consistent styling with react-hot-toast:
```
toast.success('Draft saved', { duration: 2000, position: 'bottom-right' });
toast.error('Failed to save. Please check your connection.', { duration: 4000 });
toast.loading('Submitting form...', { id: 'submit-toast' });
toast.success('Form submitted!', { id: 'submit-toast', duration: 3000 });
```

All .tsx, typed. No any.
```

---

### PROMPT 36 — Mobile Responsive Design Pass

```
Context: IIT ISM CDC Portal. Doing a full responsive design pass to ensure the entire app works well on mobile (375px) and tablet (768px).

Task: Fix and implement responsive design across all major pages. DO NOT change desktop layout — only ADD responsive behavior.

1. COMPANY DASHBOARD (DashboardClient.tsx):
- Sidebar: replace permanent drawer with MUI SwipeableDrawer on mobile
  Add hamburger icon (MenuIcon) in the top AppBar on mobile
  Sidebar width: 240px. Close on overlay click.
- Stats cards: 2-column grid on mobile (xs=6) instead of 4-column (md=3)
- Recent submissions table: hide "Season" and "Type" columns on mobile (xs)
  Show them from sm breakpoint onwards
- Quick action buttons: stack vertically on mobile

2. JNF FORM SHELL (JnfFormShell.tsx):
- Left stepper sidebar: hide on mobile
- Replace with: horizontal MUI MobileStepper at BOTTOM of page (showing current step X/7)
  With "Back" and "Next" navigation arrows
- Section header: show step number + section name as the mobile title in AppBar
- Form fields: all fields full width on mobile

3. CONTACT DETAILS SECTION:
- Three cards side by side on desktop → stack vertically on mobile (xs=12)
- Each card header: compact on mobile, full on desktop

4. ELIGIBILITY SECTION:
- Programme groups: on mobile, collapse all accordions by default (save space)
- Branch selection: horizontal scrollable chip list instead of grid on mobile

5. SALARY SECTION:
- Salary table: horizontally scrollable on mobile
  Wrap in: <Box sx={{ overflowX: 'auto' }}>
  Set minWidth: 700 on the Table

6. ADMIN DASHBOARD:
- Stats cards: 2 per row on mobile
- Two-column layout (recent submissions + companies): stack on mobile

7. ADMIN SIDEBAR:
- On mobile: hide sidebar, show hamburger menu in AppBar
- SwipeableDrawer from left

8. REVIEW PAGE:
- Two-panel layout (65/35): stack vertically on mobile (left panel first, action panel below)
- Make action panel sticky at bottom of page on mobile using position: sticky

9. LANDING PAGE:
- Navbar: hamburger menu on mobile
- Hero stats: 2x2 grid on mobile
- WHY section cards: 1 per row on mobile, 2 per row on tablet
- HOW IT WORKS stepper: vertical on mobile

Breakpoints to use (MUI defaults):
- xs: 0px (mobile phones)
- sm: 600px (large phones / small tablets)
- md: 900px (tablets / small laptops)
- lg: 1200px (desktops)
- xl: 1536px (large screens)

Test at: 375px (iPhone SE), 768px (iPad), 1024px (iPad Pro), 1440px (desktop)
All .tsx, typed.
```

---

### PROMPT 37 — Rate Limiting, Input Sanitization, and CORS Security (Laravel)

```
Context: IIT ISM CDC Portal. Implementing security features on the Laravel backend.

Task: Add security measures to the API.

1. RATE LIMITING (add to routes/api.php):

Auth endpoints — strictest limits:
POST /api/auth/send-otp — 5 per minute per IP
POST /api/auth/verify-otp — 10 per minute per IP
POST /api/auth/login — 10 per minute per IP
POST /api/auth/forgot-password — 5 per minute per IP

General API — standard limit:
All /api/* — 120 per minute per authenticated user

Implementation using Laravel's built-in throttle:
Route::middleware(['throttle:5,1'])->group(function () {
  Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
});

2. INPUT SANITIZATION:
Create app/Http/Middleware/SanitizeInput.php:
- Trim all string inputs (array_walk_recursive with trim)
- Strip HTML tags from non-rich-text fields (strip_tags)
- Preserve HTML only for fields that use rich text editor:
  job_description, jd_text (allow only safe tags: b, i, u, ul, ol, li, p, br, strong, em)
  Use strip_tags($value, '<b><i><u><ul><ol><li><p><br><strong><em>')
- Register as global middleware for all API routes

3. FILE UPLOAD VALIDATION (add to all file upload endpoints):
For company logo upload (POST /api/company/profile with logo):
- Mime type: only image/jpeg, image/png, image/webp
- Max size: 2MB (2048 KB)
- Validate image dimensions: max 2000x2000 pixels
- Rename to UUID before storing: Str::uuid() . '.' . $extension
- Store in storage/app/public/logos/

For JD PDF upload:
- Mime type: only application/pdf
- Max size: 10MB
- Rename to UUID before storing
- Store in storage/app/public/jd_pdfs/

4. AUTHORIZATION POLICY (ensure companies can only access their own data):
Create app/Policies/JnfFormPolicy.php:
- view($user, $form): $user->company->id === $form->company_id || $user->role === 'admin'
- update($user, $form): same as view but also check status === 'draft'
- submit($user, $form): $user->company->id === $form->company_id && $form->status === 'draft'

Register policy in AuthServiceProvider (or app/Providers/AppServiceProvider.php in L11).
Apply in JnfController using $this->authorize('view', $jnfForm).

5. CORS headers — verify these are in config/cors.php:
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,

6. SENSITIVE DATA — ensure these fields are NEVER returned in API responses:
User model $hidden: ['password', 'remember_token', 'otp', 'otp_expires_at']
Token is returned only on login, never in other responses
Admin notes (admin_notes field) must not appear in company-facing API responses

Add to JnfForm model:
$hidden = ['admin_notes'] — when accessed by company role
(Use a Resource class to conditionally include this field only for admin requests)

All PHP, properly typed with docblocks.
```

---

### PROMPT 38 — API Resources and Postman Collection (Laravel + Postman)

```
Context: IIT ISM CDC Portal. Creating clean API response formatting with Laravel Resources and a Postman collection for testing.

Task:

PART 1 — Laravel API Resources (ensures consistent, typed API responses):

Create these Resource classes in app/Http/Resources/:

1. UserResource:
   Fields: id, name, email, role, is_active, created_at
   
2. CompanyResource:
   Fields: id, user_id, company_name, website, sector, org_type, nature_of_business,
   date_of_establishment, annual_turnover, no_of_employees, hq_country, hq_city,
   industry_tags (cast array), social_media_url, description, 
   logo_url (full URL using Storage::url()), postal_address, is_profile_complete,
   contacts (when loaded: CompanyContactResource collection)

3. CompanyContactResource:
   Fields: id, contact_type, full_name, designation, email, mobile, alt_mobile, landline

4. JnfFormResource:
   Fields: id, company_id, season, form_type, status, submitted_at, reviewed_at,
   review_comments (only for company owner OR admin), rejection_reason,
   admin_notes (only for admin — use: $this->when($request->user()->role === 'admin', $this->admin_notes)),
   version, parent_form_id,
   company (CompanyResource — when loaded),
   job_profile (JnfJobProfileResource — when loaded),
   eligibility (JnfEligibilityResource — when loaded),
   salary (JnfSalaryResource — when loaded),
   selection_process (JnfSelectionProcessResource — when loaded),
   declaration (JnfDeclarationResource — when loaded)

5. NotificationResource:
   Fields: id, type, title, message, data, is_read, created_at (human_readable)

Use resources in all controllers: return new JnfFormResource($form) instead of $form directly.
Use JnfFormResource::collection($forms) for collections.

PART 2 — Postman Collection (create this JSON structure):

Create a file: postman_collection.json

Collection name: "IIT ISM CDC Portal API"

Environment variables needed:
- base_url: http://localhost:8000/api
- company_token: (set after login)
- admin_token: (set after admin login)
- company_id: (set after login)
- jnf_id: (set after creating JNF draft)

Folders and requests:
1. Auth: Send OTP, Verify OTP, Register, Login (company), Login (admin), Forgot Password, Reset Password, Logout
2. Company: Get Dashboard, Get Profile, Update Profile, Change Password
3. JNF: Create Draft, Get Form, Save Draft, Get Section, Submit, Download PDF, Resubmit
4. INF: Same as JNF
5. Admin - Companies: List, Get Company, Toggle Status
6. Admin - Submissions: List, Get, Update Status (approve/reject/changes), Edit Section, Bulk Action
7. Admin - Notifications: List, Mark Read, Mark All Read
8. Admin - Settings: Get Seasons, Update, List Admins, Invite Admin

Add pre-request script to Login requests:
pm.test("Login successful", () => {
  const token = pm.response.json().data.token;
  pm.environment.set("company_token", token);
});

Add test scripts to verify status codes and response shapes.
Export the collection to postman_collection.json

All PHP (Resources) with proper return types. Postman collection as valid JSON.
```

---

### PROMPT 39 — Database Seeder for Testing + Comprehensive Error Handling

```
Context: IIT ISM CDC Portal. Creating comprehensive seed data for testing all features, and adding global error handling.

Task:

PART 1 — Comprehensive Database Seeders (Laravel):

Create these seeder classes:

1. database/seeders/AdminSeeder.php:
Seed 2 admin users:
- Admin 1: name="CDC Admin", email="admin@iitism.ac.in", password=Hash::make("Admin@IITISM#2024"), role="admin"
- Admin 2: name="CDC Team", email="cdc.team@iitism.ac.in", password=Hash::make("Admin@IITISM#2024"), role="admin"

2. database/seeders/CompanySeeder.php:
Seed 5 companies with full realistic data:

Company 1: Tata Consultancy Services (TCS)
- Sector: Information Technology, Org type: MNC, HQ: Mumbai, India
- Contacts: Head HR (Priya Sharma), PoC1 (Rahul Mehta), PoC2 optional
- Status: approved JNF for 2024-25

Company 2: Oil and Natural Gas Corporation (ONGC)
- Sector: Energy & Oil, Org type: PSU
- Status: submitted JNF under review

Company 3: Tata Steel Limited
- Sector: Mining & Metals, Org type: Private (large cap)
- Status: approved INF for 2024-25

Company 4: Goldman Sachs India
- Sector: Finance & Banking, Org type: MNC, HQ: New York, USA
- Status: draft JNF (incomplete)

Company 5: Infosys Limited
- Sector: Information Technology, Org type: MNC
- Status: rejected JNF (reason: "Salary structure not as per CDC norms")

For each approved company: create a JNF with realistic data:
- TCS JNF: Software Development Engineer, Bangalore, 30 expected hires, CTC ₹7.5L for B.Tech
  Eligible: B.Tech (CSE, ECE, EE, ME, Mech), M.Tech
  Selection: Resume → Online Test (Aptitude+Technical, 90min) → Interview
- ONGC INF: Summer Research Internship, Dehradun, 50 interns
  Eligible: B.Tech (Petroleum, Mining, ME, Chemical), M.Tech, M.Sc (Applied Geology)
  Stipend: ₹15,000/month for B.Tech

3. database/seeders/NotificationSeeder.php:
Seed 8 realistic notifications for admin:
- "TCS has registered" (read)
- "ONGC has submitted a JNF" (read)
- "Tata Steel has submitted an INF" (unread)
- "Infosys has resubmitted their JNF" (unread)
- "Goldman Sachs has completed their profile" (unread)

4. Update DatabaseSeeder.php to call all seeders in order.
Run: php artisan db:seed

PART 2 — Global Error Handling (Next.js):

Create src/components/ui/ErrorBoundary.tsx:
- React class component (for error boundaries)
- Props: children, fallback (optional)
- State: hasError, error
- Shows: "Something went wrong" card with error message in dev mode
- In production: generic error message
- "Reload page" button

Create src/app/not-found.tsx:
- Custom 404 page
- IIT ISM CDC branded header
- "Page Not Found" message
- "Go to Dashboard" and "Go to Home" buttons

Create src/app/error.tsx:
- Custom error page for Next.js server errors
- Same branding
- "Try Again" button (calls reset function)

Add global Axios error interceptor enhancement in src/lib/api.ts:
- 400: Show field-level errors (Laravel validation errors have errors object)
- 401: Redirect to /login
- 403: Show "Access denied" toast + redirect to /dashboard
- 404: Show "Not found" toast
- 422: Extract validation errors and return them for form display
- 500: Show "Server error. Please try again later." toast + log to console

All .tsx for Next.js parts. PHP for seeder files.
```

---

### PROMPT 40 — Environment Config, Setup Docs, and Final Security Audit

```
Context: IIT ISM CDC Portal. Final configuration, documentation, and security hardening.

Task: Finalize project configuration and create setup documentation.

1. CREATE .env.example files:

Frontend (iitism-cdc-frontend/.env.local.example):
# Next.js
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# reCAPTCHA v2 (get from https://www.google.com/recaptcha)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

Backend (iitism-cdc-api/.env.example):
# Application
APP_NAME="IIT ISM CDC Portal"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (XAMPP defaults)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iitism_cdc
DB_USERNAME=root
DB_PASSWORD=

# Email (Mailtrap for local dev)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=cdc@iitism.ac.in
MAIL_FROM_NAME="IIT ISM CDC"

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000

# File Storage
FILESYSTEM_DISK=public

2. CREATE SETUP.md (project root):

# IIT ISM CDC Portal — Local Setup Guide

## Prerequisites
- Node.js 20+ and npm 10+
- PHP 8.2 (via XAMPP)
- Composer 2+
- MySQL via XAMPP (start Apache + MySQL in XAMPP Control Panel)
- HeidiSQL (for DB management)

## Step 1: Database Setup
1. Open HeidiSQL, connect to localhost:3306 with root user
2. Create database: iitism_cdc (utf8mb4_unicode_ci)

## Step 2: Backend Setup
```bash
cd iitism-cdc-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve --port=8000
```

## Step 3: Frontend Setup
```bash
cd iitism-cdc-frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

## Step 4: Verify
- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health
- Admin login: admin@iitism.ac.in / Admin@IITISM#2024
- Company login: hr@testcompany.com / Company@123

## Step 5: Test Email (Mailtrap)
1. Create free account at mailtrap.io
2. Get SMTP credentials from Mailtrap inbox
3. Add to backend .env

## Common Issues
- Port 3306 conflict: change XAMPP MySQL port to 3307 and update DB_PORT
- CORS error: ensure FRONTEND_URL in backend .env matches exactly http://localhost:3000
- 404 on API: ensure php artisan serve --port=8000 is running

3. FINAL SECURITY CHECKLIST (implement any missing items):

Backend:
□ APP_DEBUG=false in production .env
□ All routes have proper auth middleware
□ Sanctum tokens expire after 24 hours (config/sanctum.php: 'expiration' => 24*60)
□ Password reset tokens expire after 15 minutes
□ OTP expires after 5 minutes
□ File uploads validated for mime type AND file extension (dual check)
□ SQL injection: Eloquent ORM used everywhere (no raw queries without bindings)
□ admin_notes never returned to company users (verified via Resource class)

Frontend:
□ All admin pages have server-side session check
□ NEXTAUTH_SECRET is a cryptographically secure random string
□ No API tokens/secrets in frontend code (all in env vars)
□ All .tsx files (verify: find src -name "*.js" should return nothing)

4. CREATE .gitignore entries (both projects):
Frontend: .env.local, node_modules/, .next/, out/
Backend: .env, vendor/, storage/app/public/logos/, storage/app/public/jd_pdfs/

All files: .tsx for Next.js, .php for Laravel, .md for documentation.
```

---

## ✅ PHASE 5 CHECKPOINT — Run This After Prompt 40

```
Verify ALL of the following before proceeding to Phase 6:

□ Landing page: all sections render correctly, responsive at 375px and 1440px
□ Login page: two-panel layout on desktop, single column on mobile
□ Stats counter animation works on scroll on landing page
□ Registration wizard: all 3 steps work on mobile
□ Company dashboard: hamburger menu works on mobile
□ JNF form: mobile stepper shows at bottom on mobile
□ Salary table: scrolls horizontally on mobile
□ Admin sidebar: collapsible on mobile with swipe to close
□ PDF generates with IIT ISM header and correct data
□ Rate limiting: test by sending 6 OTP requests in 1 minute — 6th should return 429
□ Input sanitization: sending <script>alert(1)</script> in a text field stores as plain text
□ Company cannot access another company's JNF (test with Postman)
□ Non-admin cannot access /api/admin/* routes (returns 403)
□ Seeded companies show in admin dashboard with correct stats
□ 5 seeded notifications show in admin panel
□ Error page (next/error.tsx): works when triggered
□ 404 page: shows for invalid routes
□ SETUP.md created and instructions are accurate
□ .env.example files created for both projects
□ All files are .tsx (frontend) and .php (backend) — no .js or .jsx

If any check fails, fix it before continuing.
```

---

# PHASE 6 — Final Testing, Polishing, and Documentation (Prompts 41–48)

---

### PROMPT 41 — Comprehensive Postman Testing + API Contract Verification

```
Context: IIT ISM CDC Portal. Final testing phase. Verifying every API endpoint works correctly.

Task: Create a thorough Postman test suite and fix any API issues found.

Test ALL these endpoints in Postman (in order):

AUTH FLOW:
1. POST /api/health → should return 200 with {"status":"ok"}
2. POST /api/auth/send-otp with valid email → should return 200, OTP sent
3. POST /api/auth/send-otp same email again within 1 min → should still work (old OTP deleted)
4. POST /api/auth/send-otp 6th time in 1 minute → should return 429 Too Many Requests
5. POST /api/auth/verify-otp with wrong OTP → should return 400
6. POST /api/auth/verify-otp with expired OTP → should return 400
7. POST /api/auth/register with all valid data → should return 201
8. POST /api/auth/register with existing email → should return 422 with validation error
9. POST /api/auth/login valid admin → should return 200 with token and role:admin
10. POST /api/auth/login valid company → should return 200 with token and role:company
11. POST /api/auth/login wrong password → should return 401
12. POST /api/auth/login suspended account → should return 403

COMPANY API (use company token):
13. GET /api/company/dashboard → should return stats and submissions
14. GET /api/company/profile → should return full company with contacts
15. PUT /api/company/profile with valid data → should return 200
16. PUT /api/company/profile with admin token → should return 403

JNF API (company token):
17. POST /api/jnf → should create draft, return id
18. GET /api/jnf/{id} → should return full form
19. PUT /api/jnf/{id}/draft with section=job_profile → should save
20. POST /api/jnf/{id}/submit (incomplete form) → should return 422 with missing sections list
21. Fill all sections first, then POST /api/jnf/{id}/submit → should return 200, status=submitted
22. GET /api/jnf/{id} with different company's token → should return 403

ADMIN API (admin token):
23. GET /api/admin/dashboard → should return stats
24. GET /api/admin/companies → should list all companies
25. PUT /api/admin/companies/{id}/toggle-status → suspends company
26. GET /api/admin/submissions?status=submitted → should list submitted forms
27. PUT /api/admin/submissions/{id}/status with action=approve → should approve, change status
28. GET /api/admin/submissions/{id} → full form with admin_notes visible
29. GET /api/jnf/{id} with company token → admin_notes should NOT be in response
30. GET /api/admin/notifications → should list notifications, unread first

For any test that fails: document the failure and fix the underlying issue.
Fix in both the API (Laravel) and verify the frontend handles the error case correctly too.
```

---

### PROMPT 42 — Frontend TypeScript Strict Mode Audit

```
Context: IIT ISM CDC Portal. Ensuring the entire Next.js frontend is TypeScript-strict compliant with zero any types.

Task: Enable strict TypeScript and fix all resulting errors.

1. Update tsconfig.json:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}

2. Run: npx tsc --noEmit
This will output all TypeScript errors. Fix EVERY error. Common fixes needed:

a. Null/undefined handling:
WRONG: const name = user.company.company_name (company might be null)
RIGHT: const name = user.company?.company_name ?? 'Unknown'

b. Event handler typing:
WRONG: onChange={(e) => setValue(e.target.value)}
RIGHT: onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}

c. Array type assertions:
WRONG: const tags = formData.industry_tags as any
RIGHT: const tags = formData.industry_tags as string[]

d. API response typing:
WRONG: const data = response.data
RIGHT: const data = response.data as ApiResponse<Company>

e. UseRef typing:
WRONG: const ref = useRef(null)
RIGHT: const ref = useRef<HTMLDivElement>(null)

f. Form Controller typing:
WRONG: render={({ field }) => <TextField {...field} />}
RIGHT: render={({ field }: { field: ControllerRenderProps<FormData, 'field_name'> }) => <TextField {...field} />}

3. Fix ALL instances of these patterns in every .tsx file:
- Replace: as any → proper type
- Replace: : any → proper interface
- Add: missing return types on all exported functions
- Add: missing prop types on all components
- Fix: all "Object is possibly 'null'" errors with optional chaining
- Fix: all "Parameter implicitly has 'any' type" with explicit types

4. Run: npm run build
Fix ALL build errors. The project must build successfully with zero errors.

5. Run: npx eslint src --ext .tsx,.ts --fix
Fix any remaining lint issues.

After fixes: confirm npm run build outputs successfully.
```

---

### PROMPT 43 — Search Functionality and Filters on Company Dashboard

```
Context: IIT ISM CDC Portal. Company needs to search and filter their own submissions on their dashboard.

Task: Add search and filter functionality to the company dashboard.

BACKEND (Laravel):

Update CompanyDashboardController.submissions() or create new endpoint:
GET /api/company/submissions
Query params:
- search: string (searches job_title in jnf_job_profiles)
- type: 'JNF' | 'INF' | 'all'
- status: FormStatus | 'all'
- season: string | 'all'
- page: number (paginate 10 per page)

Return: PaginatedResponse<JnfForm>
Each form: id, form_type, status, season, submitted_at, version, parent_form_id,
job_profile: { job_title, place_of_posting, work_mode }

FRONTEND (Next.js):

Update src/app/(company)/dashboard/DashboardClient.tsx:

Add filter bar above the submissions table:
1. Search TextField (searches job title) — 300ms debounce
2. Form Type chips: "All" | "JNF" | "INF"
3. Status chips: "All" | "Submitted" | "Under Review" | "Approved" | "Rejected"
4. Season Select: "All Seasons" | "2024-25" | "2025-26" | "2026-27"

Behaviour:
- Filters are combined (AND logic)
- Changing any filter triggers a new API call
- Show "Showing X of Y results" text above table
- Show "Clear Filters" button when any filter is active

Table improvements:
- Add row count: show total in table footer
- Pagination: MUI TablePagination at bottom (10 per page)
- Sortable columns: click column header to sort (submitted_at, status)
- Empty state: different messages based on filter:
  * No submissions at all: "You haven't submitted any forms yet. Get started by clicking 'Submit New JNF'"
  * No results matching filter: "No submissions match your current filters. Try adjusting the filters."

Status filter chips should show counts:
e.g. "Submitted (3)" | "Approved (7)" | "Rejected (1)"
Fetch counts from the stats data already available on the dashboard.

All .tsx, typed with proper query param types.
```

---

### PROMPT 44 — Form Preview Modal (Complete Form View Before Submit)

```
Context: IIT ISM CDC Portal. Before submitting the JNF/INF form, the company should be able to see a full preview of all data they've entered — in a clean, readable format.

Task: Build the complete form preview modal (this enhances the Declaration section from Prompt 23).

Create src/components/forms/shared/FormPreviewModal.tsx:

Props:
  open: boolean
  onClose: () => void
  jnfData: JnfForm
  onEditSection: (sectionIndex: number) => void  — closes modal and navigates to that section

MODAL STRUCTURE:
MUI Dialog: fullScreen on mobile, maxWidth="lg" on desktop

Dialog AppBar:
- "Preview: [Job Title] — [Company Name]" title
- Status chip
- Close button (X)
- "Print" button (window.print())

Dialog Content (scrollable):
TABLE OF CONTENTS at top:
  1. Company Profile
  2. Contact & HR Details
  3. Job Profile
  4. Eligibility & Courses
  5. Salary Details
  6. Selection Process
  7. Declaration
(Each item is an anchor link to scroll to that section)

Each section rendered as a MUI Paper card with:
- Section number badge + Section name header
- "Edit This Section" button (pencil icon, top right of each card)
- All data displayed in a clean 2-column key-value grid:
  Key: grey, small, left aligned
  Value: dark, normal weight, right aligned

SECTION 1 — Company Profile:
Company Name | Org Type | Sector | Website | Address
Postal Address | Industry Tags (chips) | Annual Turnover | No. of Employees
Season (highlighted, important)

SECTION 2 — Contacts:
Three contact cards side by side (stack on mobile)
Each: Full Name | Designation | Email | Mobile | Landline

SECTION 3 — Job Profile:
Job Title | Designation | Place of Posting | Work Mode (chip) | Tentative Joining
Expected Hires | Min Hires | PPO Provision
Skills: displayed as chips
Job Description: rendered as HTML (dangerouslySetInnerHTML with DOMPurify sanitization)
Bond Details | Registration Link

SECTION 4 — Eligibility:
MUI Table: Programme | Branch | Min CGPA
Overall Min CGPA | Backlogs | High School % | Gender Filter
Special Requirements

SECTION 5 — Salary (JNF) or Stipend (INF):
MUI Table with all programme rows and CTC values
Currency shown in header
Additional components listed below table

SECTION 6 — Selection Process:
Timeline of enabled stages (MUI Timeline):
Each stage: icon + name + Mode + Test Type + Duration

SECTION 7 — Declaration:
Checkboxes with ✓ or ☐ icons
Signatory name and designation
Typed signature preview in cursive font

FOOTER of modal:
- "Close Preview" button
- "Submit Form" button (only active if all sections complete)

Install DOMPurify for safe HTML rendering:
npm install dompurify @types/dompurify
Usage: <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(jdHtml) }} />

All .tsx, typed, no any.
```

---

### PROMPT 45 — Company Notifications and Status Tracking (Next.js)

```
Context: IIT ISM CDC Portal. Companies need to see the status of their submissions and be informed of any CDC actions.

Task: Build the company-facing notification and status tracking features.

BACKEND (Laravel):

Create endpoint for company notifications:
GET /api/company/notifications (auth: company role)
- Return notifications for this company's user (approval, rejection, changes requested, etc.)
- Mark as read on fetch (or separately)

FRONTEND (Next.js):

1. Add notification bell to company layout (top AppBar):
Same pattern as admin notifications bell:
- Fetch unread count: GET /api/company/notifications?unread_only=true
- Poll every 60 seconds
- MUI Badge on NotificationsIcon
- Click: MUI Popover with last 5 notifications + "View All" link

2. Create src/app/(company)/notifications/page.tsx:

Notification list — same design as admin notifications page but company-facing:
Types of notifications a company receives:
- form_submitted_confirmed: "Your JNF/INF has been submitted for review"
- form_approved: "🎉 Your JNF has been approved by CDC!"
- form_rejected: "Your JNF requires attention — please review the feedback"
- changes_requested: "CDC has requested changes to your submission"
- form_resubmitted_confirmed: "Your revised form has been submitted"

Each notification:
- Icon based on type (CheckCircle green for approved, Warning amber for changes, Error red for rejected)
- Title + message
- Timestamp (relative)
- "View Form" button → /jnf/[form_id] or /inf/[form_id]

3. Create src/components/company/FormStatusTimeline.tsx:
Show on company's form view page (/jnf/[id]):

Vertical MUI Timeline showing all state changes:
- Draft created (grey)
- Submitted (blue)
- Under Review (amber)
- Changes Requested (orange) — shows CDC's comment
- Resubmitted (blue)
- Approved (green) ✓
OR
- Rejected (red) ✗ — shows rejection reason

Show this timeline on both the company view page AND the form shell (small summary in sidebar).

4. Create src/app/(company)/jnf/[id]/page.tsx:
View-only page for a submitted/approved/rejected form:
- Shows the form data read-only (same as the preview modal)
- Shows the status timeline (FormStatusTimeline component)
- Shows rejection reason or change request in a highlighted Alert if applicable
- "Revise & Resubmit" button if rejected/changes_requested
- "Download PDF" button
- Navigation breadcrumb: Dashboard > My Submissions > [Job Title]

All .tsx, typed, responsive.
```

---

### PROMPT 46 — Admin Form Statistics and Reporting Dashboard

```
Context: IIT ISM CDC Portal. Admin needs reporting capabilities to analyze placement data.

Task: Add a reporting/statistics section to the admin dashboard.

BACKEND (Laravel):

Create app/Http/Controllers/Api/Admin/ReportsController.php:

submissionStats(Request $request): GET /api/admin/reports/submissions
- Filter by season (required)
- Return:
  {
    by_status: { draft: N, submitted: N, under_review: N, approved: N, rejected: N },
    by_type: { JNF: N, INF: N },
    by_sector: { 'Information Technology': N, 'Mining & Metals': N, ... },
    total_expected_hires: sum of expected_hires from approved JNFs,
    total_expected_interns: sum from approved INFs,
    approval_rate: (approved / (approved + rejected)) * 100,
    avg_review_time_hours: average hours between submitted_at and reviewed_at,
    top_programmes: [{ course_id, name, count }] — most selected in eligibility
  }

companyStats(): GET /api/admin/reports/companies
- Return company registration trend by month (last 6 months)
- Top 5 sectors by number of companies
- Companies that submitted vs only registered (no submission)

FRONTEND (Next.js):

Create src/app/(admin)/admin/reports/page.tsx:

Season selector at top: "Select Season" MUI Select

Then display:

Row 1 — Key Metrics (4 stat cards):
- Total Approved JNFs | Expected Hires
- Total Approved INFs | Expected Interns
- Approval Rate % | Avg Review Time

Row 2 — Status Distribution:
Simple horizontal bar chart using MUI (no external chart library needed):
For each status: show a colored bar with label and percentage
Use Box components with percentage widths and status colors

Row 3 — By Sector:
MUI Table: Sector | Companies | JNFs | INFs | Approved
Sortable by column headers

Row 4 — Top Programmes Requested:
Show as an ordered list with progress bars showing relative frequency
(Which courses companies are selecting most in eligibility)

Row 5 — Monthly Registration Trend:
Simple text-based table: Month | New Companies | JNFs Submitted | Approved
For last 6 months

Add "Export to CSV" button at top:
Download all stats as a comma-separated file
File name: "CDC_Report_[Season]_[Date].csv"

Add reports link to admin sidebar navigation.
All .tsx, typed, no any.
```

---

### PROMPT 47 — Final Integration Test: Complete User Journey

```
Context: IIT ISM CDC Portal. Complete end-to-end integration testing — testing the full journey from company registration to form approval.

Task: Verify the complete user journey works end-to-end by tracing through each step and fixing any issues found.

Run this complete test scenario manually or document it as a test checklist:

JOURNEY 1 — New Company Registration and First JNF:
□ Step 1: Open http://localhost:3000 — landing page loads correctly
□ Step 2: Click "Register Company" — goes to /register
□ Step 3: Enter email (use Mailtrap sandbox email), click "Send OTP"
  - Verify OTP email arrives in Mailtrap
□ Step 4: Enter OTP, click "Verify & Continue"
□ Step 5: Fill recruiter details, strong password, click "Next"
□ Step 6: Fill all company details, upload logo (JPG, <2MB), click "Complete Registration"
  - Verify welcome email arrives in Mailtrap (with credentials)
  - Verify admin gets alert email in Mailtrap
  - Verify notification appears in admin portal bell
□ Step 7: Login with the new company credentials
  - Should redirect to /dashboard
  - Should show "Complete your company profile" banner (since just registered)
□ Step 8: Click "Submit New JNF"
  - Should show "Complete company profile first" dialog
□ Step 9: Complete company profile in /profile
  - Verify is_profile_complete updates to true in DB
□ Step 10: Click "Submit New JNF" again — should open JNF form
□ Step 11: Fill Section 1 (select season 2024-25) — verify auto-save
□ Step 12: Fill Section 2 (all 3 contacts)
□ Step 13: Fill Section 3 (job profile, add 5 skills, write JD in rich text)
□ Step 14: Fill Section 4 (select B.Tech CSE, EE, Mech — set CGPA 6.5)
□ Step 15: Fill Section 5 (₹7L CTC for B.Tech, add joining bonus)
□ Step 16: Fill Section 6 (enable: PPT, Online Test, Interview)
□ Step 17: Section 7 — click "Preview Form" — verify all data shows correctly
□ Step 18: Check all 6 declaration checkboxes, fill signatory, click "Submit JNF Form"
  - Should show confirmation dialog
□ Step 19: Confirm submission
  - Verify company gets confirmation email
  - Verify admin gets alert email
  - Verify redirect to dashboard with success toast
  - Verify form status is "submitted" in dashboard table

JOURNEY 2 — Admin Reviews and Approves:
□ Step 20: Login as admin@iitism.ac.in
□ Step 21: Check notification bell — should show new notification
□ Step 22: Go to /admin/submissions — find the newly submitted JNF
□ Step 23: Click on it — review page opens with all company data visible
□ Step 24: Click "Start Review" — status changes to "Under Review"
□ Step 25: Edit one field (e.g., change expected hires) — verify edit log created
□ Step 26: Add internal note (should NOT appear in company emails)
□ Step 27: Click "Approve Form" → confirm
  - Verify company gets approval email
  - Verify status changes to "approved" in DB
□ Step 28: Company downloads PDF — verify PDF has correct data and IIT ISM header

JOURNEY 3 — Rejection and Resubmission:
□ Step 29: Create another JNF as the company
□ Step 30: Admin rejects with reason "Salary not as per CDC norms"
  - Verify company gets rejection email with reason
□ Step 31: Company sees rejection banner on dashboard with reason
□ Step 32: Company clicks "Revise & Resubmit"
  - New version created (version: 2)
  - Form opens in draft mode with old data pre-filled
□ Step 33: Company updates salary section and resubmits
□ Step 34: Admin sees "Version 2 of 2" on the submission
□ Step 35: Admin approves version 2

Document any failures found during testing. Fix each one.
After all steps pass: the portal is ready for use.
```

---

### PROMPT 48 — Code Cleanup, Documentation Comments, and Final Build

```
Context: IIT ISM CDC Portal. Final cleanup and preparation for handover/production.

Task: Clean up all code, add documentation, and perform final build verification.

1. ADD JSDoc/TSDoc COMMENTS to all major files:

src/lib/api.ts — document each method
src/lib/constants.ts — document each constant array
src/types/index.ts — document each interface with what it represents

Each component file: add a comment at the top:
/**
 * [ComponentName]
 * @description Brief description of what this component does
 * @param {PropsType} props - Description of props
 */

Example:
/**
 * JnfFormShell
 * @description The main container for the 7-section JNF (Job Notification Form).
 * Handles stepper navigation, auto-save every 30s, and section completion tracking.
 * @param {Object} props
 * @param {number} props.jnfId - The ID of the JNF form being filled
 * @param {JnfForm} [props.initialData] - Pre-existing form data (for edit mode)
 */

2. REMOVE ALL console.log STATEMENTS:
Run: grep -r "console.log" src/
Remove every instance. Replace with proper error handling.

3. UNUSED IMPORTS CLEANUP:
Run: npx eslint src --ext .tsx,.ts --fix
Fix all "no-unused-vars" and "no-unused-imports" warnings

4. VERIFY ZERO .JS FILES:
Run: find src -name "*.js" -o -name "*.jsx"
Output should be empty. If not, rename or delete those files.

5. FINAL BUILD:
Run: npm run build
Output must show: "✓ Compiled successfully"
Zero TypeScript errors
Zero build warnings (or document any acceptable ones)

6. LARAVEL FINAL CHECKS:
Run: php artisan route:list
Verify all expected routes are listed

Run: php artisan config:cache
Run: php artisan route:cache

Add missing PHPDoc comments to all Controller methods:
/**
 * Submit a JNF form for CDC review
 *
 * @param int $id The JNF form ID
 * @return JsonResponse
 * @throws AuthorizationException If company doesn't own this form
 */

7. CREATE README.md files:

Frontend README.md:
# IIT ISM CDC Portal — Frontend
Tech: Next.js 15, TypeScript, MUI v6.5, NextAuth v5
Prerequisites, setup steps, environment variables, build command

Backend README.md:
# IIT ISM CDC Portal — Backend API
Tech: Laravel 11, PHP 8.2, MySQL/MariaDB
Prerequisites, setup steps, seeding, API documentation pointer

8. VERIFY FINAL CHECKLIST:
□ npm run build → 0 errors, 0 .js files
□ All TypeScript strict checks pass
□ All API endpoints documented in Postman
□ All emails tested in Mailtrap
□ Admin and company journeys fully tested (Prompt 47)
□ Responsive at 375px mobile and 1440px desktop
□ SETUP.md accurately reflects the setup process
□ .env.example files present and accurate
□ .gitignore covers all sensitive files

Deliver the final project in a clean state, ready for deployment.
```

---

## ✅ FINAL PHASE 6 CHECKPOINT — Run This After Prompt 48

```
FINAL VERIFICATION CHECKLIST:

□ npm run build completes with 0 TypeScript errors
□ find src -name "*.js" returns nothing (all .tsx)
□ grep -r "console.log" src returns nothing
□ All 47 routes in Postman collection return expected responses
□ Complete user journey (Prompt 47) passes all 35 steps
□ Admin journey passes all steps
□ Rejection + Resubmission journey passes
□ PDF downloads correctly for both JNF and INF
□ All emails arrive in Mailtrap with correct content and IIT ISM branding
□ Rate limiting works (6th OTP request returns 429)
□ Company cannot access admin routes (403 returned)
□ Company cannot access other company's forms (403 returned)
□ Mobile responsive verified at 375px (all pages)
□ SETUP.md tested: following it on a fresh machine successfully sets up the project
□ No hardcoded API URLs (all use process.env.NEXT_PUBLIC_API_URL)
□ No "any" types in TypeScript (verify with: npx tsc --noEmit --strict)

🎉 Portal is ready for CDC team handover!
```

---

# APPENDIX: Prompt Order Summary

| # | Phase | Description |
|---|-------|-------------|
| 1 | Foundation | Initialize Next.js frontend |
| 2 | Foundation | Folder structure, constants, types |
| 3 | Foundation | Initialize Laravel backend |
| 4 | Foundation | DB migrations: users, companies, contacts |
| 5 | Foundation | DB migrations: JNF core tables |
| 6 | Foundation | DB migrations: salary, selection, support tables |
| 7 | Foundation | Laravel models, relationships, seeder |
| 8 | Foundation | NextAuth config and route protection |
| **CP1** | | **Phase 1 Checkpoint** |
| 9 | Auth | OTP registration API (Laravel) |
| 10 | Auth | Email templates for registration |
| 11 | Auth | Registration wizard Step 1: OTP UI |
| 12 | Auth | Registration wizard Step 2: Recruiter |
| 13 | Auth | Registration wizard Step 3: Company |
| 14 | Auth | Login page |
| 15 | Auth | Forgot/reset password |
| 16 | Auth | Company dashboard home |
| **CP2** | | **Phase 2 Checkpoint** |
| 17 | JNF/INF | Form shell + stepper + auto-save |
| 18 | JNF/INF | Section 1: Company Profile + Section 2: Contacts |
| 19 | JNF/INF | Section 3: Job Profile |
| 20 | JNF/INF | Section 4: Eligibility & Courses |
| 21 | JNF/INF | Section 5: Salary Details |
| 22 | JNF/INF | Section 6: Selection Process |
| 23 | JNF/INF | Section 7: Declaration & Submit |
| 24 | JNF/INF | INF form with Stipend section |
| **CP3** | | **Phase 3 Checkpoint** |
| 25 | Admin | Admin layout + dashboard |
| 26 | Admin | Companies list |
| 27 | Admin | Submissions list |
| 28 | Admin | Form review page |
| 29 | Admin | Email templates + notification service |
| 30 | Admin | Notifications page + Settings |
| 31 | Admin | Resubmission + admin field editing |
| 32 | Admin | PDF generation + version history |
| **CP4** | | **Phase 4 Checkpoint** |
| 33 | Polish | Public landing page |
| 34 | Polish | Company profile edit + completion guard |
| 35 | Polish | Auto-save UX + unsaved warning + toasts |
| 36 | Polish | Full mobile responsive pass |
| 37 | Polish | Security: rate limiting + sanitization |
| 38 | Polish | API Resources + Postman collection |
| 39 | Polish | Seed data + global error handling |
| 40 | Polish | .env files + SETUP.md + security audit |
| **CP5** | | **Phase 5 Checkpoint** |
| 41 | Final | Comprehensive Postman API testing |
| 42 | Final | TypeScript strict mode audit |
| 43 | Final | Company search/filter features |
| 44 | Final | Form preview modal |
| 45 | Final | Company notifications + status timeline |
| 46 | Final | Admin reporting dashboard |
| 47 | Final | End-to-end integration test journey |
| 48 | Final | Code cleanup + docs + final build |
| **CP6** | | **Final Checkpoint** |
