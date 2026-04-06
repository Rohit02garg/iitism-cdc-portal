# CDC Portal — AI Coding Skills File
## Paste this alongside CONTEXT.md in every prompt

---

## SKILL 1: TypeScript Interface Patterns

Always define full interfaces before writing components. Use these as your reference:

```typescript
// src/types/index.ts — add ALL types here

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'company' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Company {
  id: number;
  user_id: number;
  company_name: string;
  website: string;
  sector: string;
  org_type: 'PSU' | 'MNC' | 'Startup' | 'NGO' | 'Private' | 'Government' | 'Other';
  nature_of_business: string;
  date_of_establishment: string | null;
  annual_turnover: string | null;
  no_of_employees: string | null;
  hq_country: string | null;
  hq_city: string | null;
  industry_tags: string[];
  social_media_url: string | null;
  description: string | null;
  logo_path: string | null;
  postal_address: string;
  is_profile_complete: boolean;
  contacts?: CompanyContact[];
}

export interface CompanyContact {
  id: number;
  company_id: number;
  contact_type: 'head_hr' | 'poc_1' | 'poc_2';
  full_name: string;
  designation: string;
  email: string;
  mobile: string;
  alt_mobile: string | null;
  landline: string | null;
}

export interface JnfForm {
  id: number;
  company_id: number;
  season: string;
  form_type: 'JNF' | 'INF';
  status: FormStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: number | null;
  review_comments: string | null;
  job_profile?: JnfJobProfile;
  eligibility?: JnfEligibility;
  salary?: JnfSalary;
  selection_process?: JnfSelectionProcess;
  company?: Company;
}

export type FormStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface JnfJobProfile {
  id: number;
  jnf_id: number;
  job_title: string;
  designation: string;
  place_of_posting: string;
  work_mode: 'onsite' | 'remote' | 'hybrid';
  expected_hires: number;
  min_hires: number | null;
  tentative_joining: string;
  skills: string[];
  jd_text: string | null;
  jd_pdf_path: string | null;
  ppo_provision: boolean;
  registration_link: string | null;
  additional_info: string | null;
  bond_details: string | null;
}

export interface JnfEligibility {
  id: number;
  jnf_id: number;
  programmes: ProgrammeEligibility[];
  min_cgpa: number | null;
  backlogs_allowed: boolean;
  highschool_percent: number | null;
  gender_filter: 'all' | 'male' | 'female' | 'other';
  per_discipline_cgpa: Record<string, number>;
  special_requirements: string | null;
}

export interface ProgrammeEligibility {
  course_id: string;  // from courses.csv id
  branch_ids: string[];  // from branches.csv id
}

export interface SalaryRow {
  course_id: string;
  ctc_annual: number | null;
  base_fixed: number | null;
  monthly_takehome: number | null;
  ug_ctc: number | null;
  pg_ctc: number | null;
}

export interface JnfSalary {
  id: number;
  jnf_id: number;
  currency: 'INR' | 'USD' | 'EUR';
  salary_same_for_all: boolean;
  salary_data: SalaryRow[];
  additional_components: AdditionalComponent[];
}

export interface AdditionalComponent {
  name: string;
  value: string;
  per_programme: boolean;
  programme_values?: Record<string, string>;
}

export interface SelectionStage {
  stage_type: 'ppt' | 'resume' | 'test' | 'gd' | 'interview' | 'custom';
  label: string;
  enabled: boolean;
  mode: 'online' | 'offline' | 'hybrid';
  test_type: 'aptitude' | 'technical' | 'written' | 'group_discussion' | null;
  duration_minutes: number | null;
  interview_mode: 'on_campus' | 'telephonic' | 'video' | null;
  custom_label: string | null;
}

export interface JnfSelectionProcess {
  id: number;
  jnf_id: number;
  stages: SelectionStage[];
  infrastructure_required: string | null;
  psychometric_test: boolean;
  medical_test: boolean;
  other_screening: string | null;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
```

---

## SKILL 2: API Layer Pattern

Every API call must go through `src/lib/api.ts`. Never use fetch() directly in components.

```typescript
// src/lib/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## SKILL 3: MUI Component Patterns

Always use these MUI patterns for consistency:

```typescript
// Page wrapper pattern
<Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
  <Container maxWidth="lg">
    {/* content */}
  </Container>
</Box>

// Form field pattern — always use Controller from react-hook-form
<Controller
  name="field_name"
  control={control}
  rules={{ required: 'This field is required' }}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      label="Field Label"
      fullWidth
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      variant="outlined"
    />
  )}
/>

// Loading state pattern
{isLoading ? (
  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
) : (
  <ActualComponent />
)}

// Status chip pattern
const statusConfig = {
  draft: { label: 'Draft', color: 'default' as const },
  submitted: { label: 'Submitted', color: 'primary' as const },
  under_review: { label: 'Under Review', color: 'warning' as const },
  approved: { label: 'Approved', color: 'success' as const },
  rejected: { label: 'Rejected', color: 'error' as const },
};
<Chip
  label={statusConfig[status].label}
  color={statusConfig[status].color}
  size="small"
/>
```

---

## SKILL 4: Form Section Pattern

Every JNF/INF section component must follow this pattern:

```typescript
// Template for any form section
interface SectionProps {
  jnfId: number;
  onComplete: (isComplete: boolean) => void;
  defaultValues?: Partial<SectionDataType>;
}

export default function SomeSection({ jnfId, onComplete, defaultValues }: SectionProps) {
  const { control, handleSubmit, watch, formState: { errors, isDirty } } = useForm<SectionDataType>({
    defaultValues: defaultValues ?? {},
  });

  const [isSaving, setIsSaving] = useState(false);

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      if (isDirty) await autoSave();
    }, 30000);
    return () => clearInterval(timer);
  }, [isDirty]);

  const autoSave = async () => {
    setIsSaving(true);
    try {
      const values = watch();
      await api.put(`/jnf/${jnfId}/draft`, { section: 'section_name', data: values });
      toast.success('Draft saved', { duration: 1500 });
    } catch { toast.error('Auto-save failed'); }
    finally { setIsSaving(false); }
  };

  // Check completion
  useEffect(() => {
    const subscription = watch((values) => {
      const isComplete = checkIfComplete(values);
      onComplete(isComplete);
    });
    return () => subscription.unsubscribe();
  }, [watch, onComplete]);

  return (
    <Box component="form" onSubmit={handleSubmit(autoSave)}>
      {/* Fields */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={autoSave}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
      </Box>
    </Box>
  );
}
```

---

## SKILL 5: Constants File Pattern

All data from the CSVs must live in `src/lib/constants.ts` — never hardcode in components.

```typescript
// src/lib/constants.ts

export const DEPARTMENTS = [
  { id: 'agl', name: 'Applied Geology' },
  { id: 'agp', name: 'Applied Geophysics' },
  { id: 'ccb', name: 'Chemistry and Chemical Biology' },
  { id: 'ce', name: 'Chemical Engineering' },
  { id: 'cse', name: 'Computer Science and Engineering' },
  { id: 'cve', name: 'Civil Engineering' },
  { id: 'ece', name: 'Electronics Engineering' },
  { id: 'ee', name: 'Electrical Engineering' },
  { id: 'ese', name: 'Environmental Science & Engineering' },
  { id: 'fme', name: 'Fuel, Minerals and Metallurgical Engineering' },
  { id: 'hss', name: 'Humanities and Social Sciences' },
  { id: 'mc', name: 'Mathematics and Computing' },
  { id: 'me', name: 'Mining Engineering' },
  { id: 'mech', name: 'Mechanical Engineering' },
  { id: 'msie', name: 'Management Studies and Industrial Engineering' },
  { id: 'pe', name: 'Petroleum Engineering' },
  { id: 'phy', name: 'Physics' },
] as const;

export const COURSES = [
  { id: 'b.tech', name: 'B.Tech', fullName: 'Bachelor of Technology', duration: 4 },
  { id: 'be', name: 'B.E.', fullName: 'Bachelor of Engineering', duration: 4 },
  { id: 'dualdegree', name: 'Dual Degree', fullName: 'Dual Degree', duration: 5 },
  { id: 'int.m.sc', name: 'Int. M.Sc', fullName: 'Integrated Master of Science', duration: 5 },
  { id: 'int.m.tech', name: 'Int. M.Tech', fullName: 'Integrated Master of Technology', duration: 5 },
  { id: 'int.msc.tech', name: 'Int. M.Sc.Tech', fullName: 'Integrated M.Sc and Technology', duration: 5 },
  { id: 'm.sc', name: 'M.Sc', fullName: 'Master of Science', duration: 2 },
  { id: 'm.sc.tech', name: 'M.Sc.Tech', fullName: 'Master of Science and Technology', duration: 3 },
  { id: 'm.tech', name: 'M.Tech', fullName: 'Master of Technology', duration: 2 },
  { id: 'mba', name: 'MBA', fullName: 'Master of Business Administration', duration: 2 },
  { id: 'mbaba', name: 'MBA (BA)', fullName: 'MBA (Business Analytics)', duration: 2 },
  { id: 'jrf', name: 'Ph.D', fullName: 'Doctor of Philosophy', duration: 7 },
  { id: 'ma', name: 'M.A.', fullName: 'Master of Arts', duration: 2 },
  { id: 'execmba', name: 'Exec. MBA', fullName: 'Executive MBA', duration: 3 },
  { id: '3yrmtech', name: 'M.Tech (3yr)', fullName: 'M.Tech (3 Years)', duration: 3 },
  { id: 'doublemajor', name: 'Double Major', fullName: 'Double Major', duration: 2 },
  { id: 'pgd', name: 'PG Diploma', fullName: 'PG Diploma', duration: 2 },
  { id: 'dd.b.tech', name: 'DD B.Tech+MBA', fullName: 'Dual Degree B.Tech With MBA', duration: 5 },
  { id: 'int.bsms', name: 'Int. BS+MS', fullName: 'Integrated B.Sc + M.Sc', duration: 5 },
] as const;

export const BRANCHES = [
  { id: 'agl', name: 'Applied Geology' },
  { id: 'agp', name: 'Applied Geophysics' },
  { id: 'phy', name: 'Physics' },
  { id: 'chem', name: 'Chemistry' },
  { id: 'civ', name: 'Civil Engineering' },
  { id: 'cse', name: 'Computer Science and Engineering' },
  { id: 'ece', name: 'Electronics and Communication Engineering' },
  { id: 'ee', name: 'Electrical Engineering' },
  { id: 'eg', name: 'Engineering Geology' },
  { id: 'env', name: 'Environmental Engineering' },
  { id: 'ep', name: 'Engineering Physics' },
  { id: 'eqse', name: 'Earthquake Science & Engineering' },
  { id: 'ese', name: 'Environmental Science and Engineering' },
  { id: 'fe', name: 'Fuel Engineering' },
  { id: 'geo', name: 'Geomatics' },
  { id: 'gte', name: 'Geotechnical Engineering' },
  { id: 'iem', name: 'Industrial Engineering and Management' },
  { id: 'm&c', name: 'Mathematics and Computing' },
  { id: 'me', name: 'Mining Engineering' },
  { id: 'mech', name: 'Mechanical Engineering' },
  { id: 'mech+mfg', name: 'Mech. Engg. (Spl: Manufacturing)' },
  { id: 'mech+te', name: 'Mech. Engg. (Spl: Thermal Engineering)' },
  { id: 'mee', name: 'Mech. Engg. (Spl: Machine Design)' },
  { id: 'met', name: 'Mech. Engg. (Spl: Maintenance & Tribology)' },
  { id: 'mexp', name: 'Mineral Exploration' },
  { id: 'mineee', name: 'Mine Electrical Engineering' },
  { id: 'mle', name: 'Mineral Engineering' },
  { id: 'mme', name: 'Mining Machinery Engineering' },
  { id: 'ocm', name: 'Opencast Mining' },
  { id: 'ooce', name: 'Optoelectronics and Optical Communication' },
  { id: 'pe', name: 'Petroleum Engineering' },
  { id: 'peed', name: 'Power Electronics and Electrical Drives' },
  { id: 'pexp', name: 'Petroleum Exploration' },
  { id: 'pse', name: 'Power System Engineering' },
  { id: 'rfme', name: 'RF & Microwave Engineering' },
  { id: 'se', name: 'Structural Engineering' },
  { id: 'tust', name: 'Tunnelling and Underground Space Technology' },
  { id: 'vlsid', name: 'VLSI Design' },
  { id: 'da', name: 'Data Analytics' },
  { id: 'gexp', name: 'Geo-Exploration' },
  { id: 'ce', name: 'Chemical Engineering' },
  { id: 'hss', name: 'Humanities & Social Sciences' },
  { id: 'es', name: 'Environmental Science' },
  { id: 'math', name: 'Mathematics' },
  { id: 'stat', name: 'Statistics' },
  { id: 'mgmt', name: 'Management' },
  { id: 'csp', name: 'Communication and Signal Processing' },
  { id: 'ei', name: 'Electronics and Instrumentation Engineering' },
  { id: 'om', name: 'Operation Management' },
  { id: 'fm', name: 'Financial Management' },
  { id: 'ba', name: 'Business Analytics' },
  { id: 'phse', name: 'Pharmaceutical Science & Engineering' },
  { id: 'philo', name: 'Philosophy' },
  { id: 'mlmte', name: 'Minerals and Metallurgical Engineering' },
  { id: 'fmme', name: 'Fuel, Minerals and Metallurgical Engineering' },
  { id: 'smc', name: 'Social Media and Culture' },
  { id: 'psycho', name: 'Psychology' },
  { id: 'soci', name: 'Sociology' },
  { id: 'dhss', name: 'Digital Humanities and Social Sciences' },
  { id: 'mte', name: 'Metallurgical Engineering' },
  { id: 'fee', name: 'Fuel & Energy Engineering' },
  { id: 'ocip', name: 'Optical Communication & Integrated Photonics' },
  { id: 'eai', name: 'Artificial Intelligence & Data Science' },
  { id: 'cwr', name: 'Water Resources Engineering' },
  { id: 'twr', name: 'Transportation Engineering' },
  { id: 'memba', name: 'Mining Engineering & MBA' },
] as const;

export const ORG_TYPES = ['PSU', 'MNC', 'Startup', 'NGO', 'Private', 'Government', 'Other'] as const;

export const SECTORS = [
  'Information Technology', 'Core Engineering', 'Finance & Banking',
  'Consulting', 'Energy & Oil', 'Mining & Metals', 'Manufacturing',
  'Pharmaceuticals', 'FMCG', 'Automobile', 'Aerospace & Defence',
  'Infrastructure', 'Research & Development', 'Government / PSU',
  'Analytics & Data Science', 'E-Commerce', 'Telecommunications', 'Other',
] as const;

export const CURRENCIES = ['INR', 'USD', 'EUR'] as const;
export const WORK_MODES = ['onsite', 'remote', 'hybrid'] as const;
export const GENDER_FILTERS = ['all', 'male', 'female', 'other'] as const;

export const RECRUITMENT_SEASONS = [
  '2024-25', '2025-26', '2026-27',
] as const;

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'default' as const, bgColor: '#9e9e9e' },
  submitted: { label: 'Submitted', color: 'primary' as const, bgColor: '#1565c0' },
  under_review: { label: 'Under Review', color: 'warning' as const, bgColor: '#f57c00' },
  approved: { label: 'Approved', color: 'success' as const, bgColor: '#2e7d32' },
  rejected: { label: 'Rejected', color: 'error' as const, bgColor: '#c62828' },
} as const;
```

---

## SKILL 6: Error Handling Pattern

```typescript
// Always wrap API calls like this
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await api.get<ApiResponse<DataType>>('/endpoint');
    setData(response.data.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message ?? 'Something went wrong');
    } else {
      setError('An unexpected error occurred');
    }
  } finally {
    setIsLoading(false);
  }
};

// In JSX — always show error state
{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
```

---

## SKILL 7: Route Protection Pattern

```typescript
// Every admin page must start with this
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }
  return <AdminPageClient />;
}
```

---

## SKILL 8: MUI Theme Configuration

```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1a237e', light: '#534bae', dark: '#000051' },
    secondary: { main: '#b71c1c', light: '#f05545', dark: '#7f0000' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    success: { main: '#2e7d32' },
    warning: { main: '#f57c00' },
    error: { main: '#c62828' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'medium' },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6 } },
    },
  },
  shape: { borderRadius: 8 },
});
```

---

## SKILL 9: Laravel Controller Pattern

```php
<?php
// Every controller method must follow this pattern

public function index(Request $request): JsonResponse
{
    try {
        $data = Model::with(['relations'])
            ->where('user_id', auth()->id())
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch data: ' . $e->getMessage(),
        ], 500);
    }
}

public function store(StoreRequest $request): JsonResponse
{
    try {
        $model = Model::create($request->validated());
        return response()->json(['success' => true, 'data' => $model], 201);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}
```

---

## SKILL 10: Responsive Layout Pattern

```typescript
// Always make layouts responsive with MUI breakpoints
<Grid container spacing={{ xs: 2, md: 3 }}>
  <Grid item xs={12} md={6} lg={4}>
    {/* Card */}
  </Grid>
</Grid>

// Responsive typography
<Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>

// Responsive padding
<Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

// Hide on mobile
<Box sx={{ display: { xs: 'none', md: 'block' } }}>

// Responsive stepper direction
<Stepper
  orientation={isMobile ? 'horizontal' : 'vertical'}
  activeStep={activeStep}
>
```

---

## SKILL 11: Checklist Before Submitting Each Prompt Result

Before you consider any component "done", verify:

- [ ] File extension is `.tsx` (not `.js`, `.jsx`, `.ts` for component files)
- [ ] All props have TypeScript types defined
- [ ] No `any` type used anywhere
- [ ] All API calls use the `api` instance from `src/lib/api.ts`
- [ ] Loading state shown while API call is in progress
- [ ] Error state shown if API call fails
- [ ] Form fields use `Controller` from `react-hook-form`
- [ ] All text inputs have appropriate validation rules
- [ ] Component is responsive (check at 375px mobile width)
- [ ] No hardcoded strings for dropdowns — use `CONSTANTS` from `src/lib/constants.ts`
- [ ] No `console.log` statements
- [ ] Page-level route protection is in place (server-side for admin pages)
- [ ] MUI `sx` prop used for all styling (no CSS files, no Tailwind)
