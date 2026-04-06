/**
 * IIT (ISM) Dhanbad CDC Portal — Data Constants
 * Extracted from official institute records (status=1 entries only)
 */

export const DEPARTMENTS = [
  { id: 'agl', name: 'Applied Geology' },
  { id: 'agp', name: 'Applied Geophysics' },
  { id: 'ccb', name: 'Chemistry and Chemical Biology' },
  { id: 'ce', name: 'Chemical Engineering' },
  { id: 'ciie', name: 'Centre for Innovation Incubation and Entrepreneurship' },
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
];

export const BRANCHES = [
  { id: 'agl', name: 'Applied Geology' },
  { id: 'agp', name: 'Applied Geophysics' },
  { id: 'phy', name: 'Physics' },
  { id: 'chem', name: 'Chemistry' },
  { id: 'civ', name: 'Civil Engineering' },
  { id: 'cse', name: 'Computer Science and Engineering' },
  { id: 'cse+cse', name: 'CSE + CSE (Dual)' },
  { id: 'ece', name: 'Electronics and Communication Engineering' },
  { id: 'ee', name: 'Electrical Engineering' },
  { id: 'eg', name: 'Engineering Geology' },
  { id: 'env', name: 'Environmental Engineering' },
  { id: 'ep', name: 'Engineering Physics' },
  { id: 'm&c', name: 'Mathematics and Computing' },
  { id: 'mba', name: 'Master of Business Administration' },
  { id: 'me', name: 'Mining Engineering' },
  { id: 'mech', name: 'Mechanical Engineering' },
  { id: 'pe', name: 'Petroleum Engineering' },
  { id: 'phd', name: 'Doctor of Philosophy' },
  { id: 'da', name: 'Data Analytics' },
  { id: 'ce', name: 'Chemical Engineering' },
];

export const COURSES = [
  { id: 'b.tech', name: 'Bachelor of Technology', duration: '4 years' },
  { id: 'be', name: 'Bachelor of Engineering', duration: '4 years' },
  { id: 'dualdegree', name: 'Dual Degree', duration: '5 years' },
  { id: 'int.m.sc', name: 'Integrated Master of Science', duration: '5 years' },
  { id: 'int.m.tech', name: 'Integrated Master of Technology', duration: '5 years' },
  { id: 'm.sc', name: 'Master of Science', duration: '2 years' },
  { id: 'm.tech', name: 'Master of Technology', duration: '2 years' },
  { id: 'mba', name: 'Master of Business Administration', duration: '2 years' },
  { id: 'jrf', name: 'Doctor of Philosophy', duration: '7 years' },
];

export const ORG_TYPES = ['PSU', 'MNC', 'Startup', 'NGO', 'Private', 'Government', 'Other'];

export const SECTORS = [
  'Information Technology',
  'Core (Technical)',
  'Finance / Banking',
  'Consulting',
  'Analytics',
  'Oil & Gas / Energy',
  'Mining / Minerals',
  'Research & Development',
  'FMCG / Retail',
  'Education / EdTech',
  'Manufacturing',
  'Public Sector',
  'Other',
];

export const CURRENCIES = ['INR', 'USD', 'EUR'];

export const WORK_MODES = ['onsite', 'remote', 'hybrid'];

export const GENDER_FILTERS = ['all', 'male', 'female', 'other'];

export const RECRUITMENT_SEASONS = ['2024-25', '2025-26', '2026-27'];

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'grey' },
  submitted: { label: 'Submitted', color: '#1565c0' },
  under_review: { label: 'Under Review', color: '#f57c00' },
  approved: { label: 'Approved', color: '#2e7d32' },
  rejected: { label: 'Rejected', color: '#c62828' },
};
