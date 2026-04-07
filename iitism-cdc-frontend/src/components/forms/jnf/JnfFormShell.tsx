'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import CompanyProfileSection from './sections/CompanyProfileSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import JobProfileSection from './sections/JobProfileSection';
import EligibilitySection from './sections/EligibilitySection';
import SalarySection from './sections/SalarySection';
import SelectionProcessSection from './sections/SelectionProcessSection';
import DeclarationSection from './sections/DeclarationSection';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const STEPS = [
  'Company Profile',
  'Contact & HR Details',
  'Job Profile',
  'Eligibility & Courses',
  'Salary Details',
  'Selection Process',
  'Declaration & Submit'
];

// Normalize server response to match frontend field names exactly
function normalizeServerData(d: any): any {
  if (!d) return d;
  return {
    ...d,
    // contacts is stored as raw JSON blob, already in frontend shape
    contacts: d.contacts || null,
    // job_profile: server uses job_title/jd_text, frontend uses profile_name/job_description
    job_profile: d.job_profile ? {
      profile_name: d.job_profile.job_title ?? d.job_profile.profile_name ?? '',
      designation: d.job_profile.designation ?? '',
      place_of_posting: d.job_profile.place_of_posting ?? '',
      work_mode: d.job_profile.work_mode ?? null,
      tentative_joining: d.job_profile.tentative_joining ?? null,
      expected_hires: d.job_profile.expected_hires ?? '',
      min_hires: d.job_profile.min_hires ?? '',
      skills: d.job_profile.skills ?? [],
      job_description: d.job_profile.jd_text ?? d.job_profile.job_description ?? '',
      use_pdf_for_jd: !!(d.job_profile.jd_pdf_path),
      jd_pdf_path: d.job_profile.jd_pdf_path ?? '',
      ppo_provision: d.job_profile.ppo_provision ?? false,
      registration_link: d.job_profile.registration_link ?? '',
      additional_info: d.job_profile.additional_info ?? '',
      bond_details: d.job_profile.bond_details ?? '',
      onboarding_procedure: d.job_profile.onboarding_procedure ?? '',
    } : null,
    // eligibility: server uses programmes/highschool_percent/enum gender, frontend uses courses/high_school_percentage/label gender
    eligibility: d.eligibility ? {
      courses: d.eligibility.programmes ?? d.eligibility.courses ?? [],
      min_cgpa: d.eligibility.min_cgpa ?? '',
      backlogs_allowed: d.eligibility.backlogs_allowed === true ? 'Yes' : (d.eligibility.backlogs_allowed === false ? 'No' : (d.eligibility.backlogs_allowed ?? 'No')),
      high_school_percentage: d.eligibility.highschool_percent ?? d.eligibility.high_school_percentage ?? '',
      gender_filter: d.eligibility.gender_filter === 'male' ? 'Male Only'
                   : d.eligibility.gender_filter === 'female' ? 'Female Only'
                   : d.eligibility.gender_filter === 'other' ? 'Others Only'
                   : d.eligibility.gender_filter === 'all' ? 'All Genders'
                   : d.eligibility.gender_filter ?? 'All Genders',
      per_discipline_cgpa: d.eligibility.per_discipline_cgpa ?? [],
      special_requirements: d.eligibility.special_requirements ?? '',
    } : null,
    // salary: server uses salary_data/salary_same_for_all/additional_components, frontend uses salaries/same_for_all/additional_global
    salary: d.salary ? {
      currency: d.salary.currency ?? 'INR',
      same_for_all: d.salary.salary_same_for_all ?? d.salary.same_for_all ?? true,
      salaries: d.salary.salary_data ?? d.salary.salaries ?? [],
      same_additional_for_all: d.salary.additional_components?.same_additional_for_all ?? d.salary.same_additional_for_all ?? true,
      additional_global: d.salary.additional_components?.global ?? d.salary.additional_global ?? null,
      additional_per_course: d.salary.additional_components?.per_course ?? d.salary.additional_per_course ?? {},
    } : null,
    // selection_process: server wraps in stages/infrastructure_required, frontend uses flat keys
    selection_process: d.selection_process ? {
      ppt: d.selection_process.stages?.ppt ?? d.selection_process.ppt ?? { enabled: false, rounds: [{ mode: null, duration: '' }] },
      resume_shortlisting: d.selection_process.stages?.resume_shortlisting ?? d.selection_process.resume_shortlisting ?? { enabled: false, rounds: [{ mode: null }] },
      test: d.selection_process.stages?.test ?? d.selection_process.test ?? { enabled: false, rounds: [{ mode: null, test_type: '', duration: '' }] },
      group_discussion: d.selection_process.stages?.group_discussion ?? d.selection_process.group_discussion ?? { enabled: false, rounds: [{ mode: null, duration: '' }] },
      interview: d.selection_process.stages?.interview ?? d.selection_process.interview ?? { enabled: false, rounds: [{ mode: null, interview_mode: '', duration: '', round_name: '' }] },
      visit_team_size: d.selection_process.infrastructure_required?.visit_team_size ?? d.selection_process.visit_team_size ?? '',
      rooms_required: d.selection_process.infrastructure_required?.rooms_required ?? d.selection_process.rooms_required ?? '',
      special_infrastructure: d.selection_process.infrastructure_required?.special_infrastructure ?? d.selection_process.special_infrastructure ?? '',
      psychometric_test: d.selection_process.psychometric_test ?? false,
      psychometric_test_details: d.selection_process.psychometric_test_details ?? '',
      medical_test: d.selection_process.medical_test ?? false,
      medical_test_details: d.selection_process.medical_test_details ?? '',
      other_screening: d.selection_process.other_screening ?? false,
      other_screening_details: d.selection_process.other_screening_details ?? '',
    } : null,
    // declaration: server uses aipc_agreed/shortlisting_agreed/etc, frontend uses agree_aipc/agree_shortlisting_timeline/etc
    declaration: d.declaration ? {
      agree_aipc: d.declaration.aipc_agreed ?? d.declaration.agree_aipc ?? false,
      agree_shortlisting_timeline: d.declaration.shortlisting_agreed ?? d.declaration.agree_shortlisting_timeline ?? false,
      agree_correct_info: d.declaration.info_verified ?? d.declaration.agree_correct_info ?? false,
      consent_share_data_media: d.declaration.ranking_consent ?? d.declaration.consent_share_data_media ?? false,
      agree_terms_conditions: d.declaration.accuracy_confirmed ?? d.declaration.agree_terms_conditions ?? false,
      consent_rti_nirf: d.declaration.rti_nirf_consent ?? d.declaration.consent_rti_nirf ?? false,
      signatory_name: d.declaration.signatory_name ?? '',
      signatory_designation: d.declaration.signatory_designation ?? '',
      signature_date: d.declaration.signatory_date ?? d.declaration.signature_date ?? null,
      typed_signature: d.declaration.typed_signature ?? '',
    } : null,
  };
}

interface JnfFormShellProps {
  jnfId: number;
}

export default function JnfFormShell({ jnfId }: JnfFormShellProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const fetchJnf = useCallback(async () => {
    try {
      const res = await api.get(`/jnf/${jnfId}`);
      const json = res.data;
      if (json.success) {
        const normalized = normalizeServerData(json.data);
        setFormData(normalized);
        const initCompleted: { [k: number]: boolean } = {};
        if (normalized.company) initCompleted[0] = true;
        if (normalized.contacts) initCompleted[1] = true;
        if (normalized.job_profile) initCompleted[2] = true;
        if (normalized.eligibility) initCompleted[3] = true;
        if (normalized.salary) initCompleted[4] = true;
        if (normalized.selection_process) initCompleted[5] = true;
        setCompleted(initCompleted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jnfId]);

  useEffect(() => {
    fetchJnf();
  }, [fetchJnf]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleStep = (step: number) => () => setActiveStep(step);

  const handleSave = useCallback(async (section: string, data: object) => {
    try {
      await api.put(`/jnf/${jnfId}/draft`, { section, data });
      const now = new Date();
      setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      setSaveToast(true);

      // Update local formData so tab switches see latest data immediately
      const sectionKeyMap: Record<string, string> = {
        'contacts': 'contacts',
        'job_profile': 'job_profile',
        'eligibility': 'eligibility',
        'salary': 'salary',
        'selection_process': 'selection_process',
        'declaration': 'declaration',
      };
      const key = sectionKeyMap[section];
      if (key) {
        setFormData((prev: any) => ({ ...prev, [key]: data }));
      }
    } catch (e) {
      console.error('Auto-save failed', e);
    }
  }, [jnfId]);

  const handleSubmit = async () => {
    try {
      const res = await api.put(`/jnf/${jnfId}/submit`);
      const json = res.data;
      if (json.success) {
        router.push('/dashboard?success=jnf_submitted');
      } else {
        alert(json.message || 'Submission failed');
      }
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || 'Error submitting form');
    }
  };

  const handleComplete = useCallback((stepIdx: number, isComplete: boolean) => {
    setCompleted(prev => {
      if (prev[stepIdx] === isComplete) return prev;
      return { ...prev, [stepIdx]: isComplete };
    });
  }, []);

  const allSectionsComplete = [0, 1, 2, 3, 4, 5].every(i => completed[i]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

  const renderSection = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <CompanyProfileSection jnfId={jnfId} companyData={formData?.company || {}} onSave={handleSave} onComplete={(c) => handleComplete(0, c)} />;
      case 1:
        return <ContactDetailsSection jnfId={jnfId} onSave={handleSave} onComplete={(c) => handleComplete(1, c)} initialData={formData?.contacts} />;
      case 2:
        return <JobProfileSection jnfId={jnfId} onSave={handleSave} onComplete={(c) => handleComplete(2, c)} defaultValues={formData?.job_profile} />;
      case 3:
        return <EligibilitySection jnfId={jnfId} onSave={handleSave} onComplete={(c) => handleComplete(3, c)} defaultValues={formData?.eligibility} />;
      case 4:
        return <SalarySection jnfId={jnfId} onSave={handleSave} onComplete={(c) => handleComplete(4, c)} defaultValues={formData?.salary} />;
      case 5:
        return <SelectionProcessSection jnfId={jnfId} onSave={handleSave} onComplete={(c) => handleComplete(5, c)} defaultValues={formData?.selection_process} />;
      case 6:
        return <DeclarationSection jnfId={jnfId} onSave={handleSave} onSubmit={handleSubmit} onComplete={(c) => handleComplete(6, c)} defaultValues={formData?.declaration} allSectionsComplete={allSectionsComplete} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 10 }}>
      {lastSavedTime && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white', px: 2, py: 1, borderRadius: 8 }}>
          <Typography variant="body2">Auto-saved at {lastSavedTime}</Typography>
        </Box>
      )}
      <Snackbar open={saveToast} autoHideDuration={2000} onClose={() => setSaveToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>Draft Saved!</Alert>
      </Snackbar>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: 'primary.main' }}>JNF — Job Notification Form</Typography>

      <Stepper nonLinear activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 6, overflowX: 'auto', pb: 2 }}>
        {STEPS.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepLabel onClick={handleStep(index)} sx={{ cursor: 'pointer' }}>
              <Typography variant="body2" fontWeight={activeStep === index ? 700 : 400}>{label}</Typography>
            </StepLabel>
            {isMobile && (
              <StepContent>
                <Box sx={{ my: 2 }}>{renderSection(index)}</Box>
                <Box sx={{ mb: 2 }}>
                  <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>{index === STEPS.length - 1 ? 'Finish' : 'Continue'}</Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>Back</Button>
                </Box>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>

      {!isMobile && (
        <React.Fragment>
          <Box sx={{ minHeight: 400, mb: 4 }}>
            {renderSection(activeStep)}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 4, borderTop: '1px solid #ccc' }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep !== STEPS.length - 1 && (
              <Button onClick={handleNext} variant="contained" disabled={!completed[activeStep]}>Next Step</Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
