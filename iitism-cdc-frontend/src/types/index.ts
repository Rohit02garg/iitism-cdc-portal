/**
 * IIT (ISM) Dhanbad CDC Portal — Types & Interfaces
 */

export type UserRole = 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export type OrgType = 'PSU' | 'MNC' | 'Startup' | 'NGO' | 'Private' | 'Government' | 'Other';

export interface CompanyContact {
  id: string;
  full_name: string;
  designation: string;
  email: string;
  mobile: string;
  alt_mobile?: string;
  contact_type: 'head_hr' | 'poc_1' | 'poc_2';
}

export interface Company {
  id: string;
  company_name: string;
  website?: string;
  sector: string;
  org_type: OrgType;
  nature_of_business?: string;
  postal_address: string;
  is_profile_complete: boolean;
  contacts: CompanyContact[];
}

export type FormStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface SalaryRow {
  course_id: string;
  ctc_annual?: string;
  base_fixed?: string;
  monthly_takehome?: string;
  base_stipend?: string;
  hra?: string;
  variable_pay?: string;
}

export interface JnfSalary {
  id: string;
  currency: 'INR' | 'USD' | 'EUR';
  salary_same_for_all: boolean;
  salary_data: SalaryRow[];
}

export interface JnfJobProfile {
  id: string;
  job_title: string;
  designation?: string;
  place_of_posting: string;
  work_mode: 'onsite' | 'remote' | 'hybrid';
  expected_hires: number;
  skills: string[];
}

export interface ProgrammeEligibility {
  course_id: string;
  branch_ids: string[];
}

export interface JnfEligibility {
  id: string;
  programmes: ProgrammeEligibility[];
  min_cgpa?: number;
  backlogs_allowed: boolean;
}

export type SelectionStageType = 'ppt' | 'resume' | 'test' | 'gd' | 'interview' | 'custom';

export interface SelectionStage {
  stage_type: SelectionStageType;
  label: string;
  mode: 'online' | 'offline' | 'hybrid';
}

export interface JnfSelectionProcess {
  id: string;
  stages: SelectionStage[];
}

export interface JnfForm {
  id: string;
  company_id: string;
  season: string;
  form_type: 'JNF' | 'INF';
  status: FormStatus;
  submitted_at?: string;
  job_profile: JnfJobProfile;
  eligibility: JnfEligibility;
  salary: JnfSalary;
  selection_process: JnfSelectionProcess;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}
