'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { Work as WorkIcon, Home as HomeIcon, Devices as DevicesIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';



export interface JnfJobProfile {
  profile_name: string;
  designation: string;
  place_of_posting: string;
  work_mode: 'onsite' | 'remote' | 'hybrid' | null;
  tentative_joining: string | null;
  expected_hires: number | '';
  min_hires?: number | '';
  skills: string[];
  job_description: string;
  use_pdf_for_jd: boolean;
  jd_pdf_path?: string;
  ppo_provision: boolean;
  registration_link?: string;
  additional_info?: string;
  bond_details?: string;
  onboarding_procedure?: string;
}

interface JobProfileSectionProps {
  jnfId: number;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
  defaultValues?: Partial<JnfJobProfile>;
  formType?: 'JNF' | 'INF';
}

export default function JobProfileSection({
  jnfId,
  onSave,
  onComplete,
  defaultValues,
  formType = 'JNF'
}: JobProfileSectionProps) {

  const [skillInput, setSkillInput] = useState('');
  const [jdFile, setJdFile] = useState<File | null>(null);

  const { control, watch, setValue, getValues, formState: { errors } } = useForm<JnfJobProfile>({
    defaultValues: {
      profile_name: (defaultValues as any)?.job_title ?? defaultValues?.profile_name ?? '',
      designation: defaultValues?.designation || '',
      place_of_posting: defaultValues?.place_of_posting || '',
      work_mode: defaultValues?.work_mode || null,
      tentative_joining: defaultValues?.tentative_joining || null,
      expected_hires: defaultValues?.expected_hires ?? '',
      min_hires: defaultValues?.min_hires ?? '',
      skills: defaultValues?.skills || [],
      job_description: defaultValues?.job_description || '',
      use_pdf_for_jd: defaultValues?.use_pdf_for_jd || false,
      jd_pdf_path: defaultValues?.jd_pdf_path || '',
      ppo_provision: defaultValues?.ppo_provision || false,
      registration_link: defaultValues?.registration_link || '',
      additional_info: defaultValues?.additional_info || '',
      bond_details: defaultValues?.bond_details || '',
      onboarding_procedure: defaultValues?.onboarding_procedure || '',
    },
    mode: 'onChange'
  });

  const formValues = watch();

  // Refs for unmount save
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Save immediately on unmount
  useEffect(() => {
    return () => {
      onSaveRef.current('job_profile', formValuesRef.current);
    };
  }, []);

  useEffect(() => {
    const requiredFilled = !!(
      formValues.profile_name &&
      formValues.place_of_posting &&
      formValues.work_mode &&
      formValues.tentative_joining &&
      formValues.expected_hires &&
      !errors.profile_name &&
      !errors.place_of_posting &&
      !errors.expected_hires
    );
    onComplete(requiredFilled);

    const timeout = setTimeout(() => {
      onSave('job_profile', formValues);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave, errors]);

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !formValues.skills.includes(val) && formValues.skills.length < 20) {
        setValue('skills', [...formValues.skills, val], { shouldValidate: true, shouldDirty: true });
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue('skills', formValues.skills.filter(s => s !== skillToRemove), { shouldValidate: true, shouldDirty: true });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large. Maximum size is 10MB.');
        return;
      }
      setJdFile(file);
      // We would ideally upload this to API, get URL and set into form state.
      // Mocking successful upload assignment to jd_pdf_path
      setValue('jd_pdf_path', file.name, { shouldValidate: true, shouldDirty: true });
    }
  };

  // React quill module mapping
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      ['clean']
    ]
  }), []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {formType === 'INF' ? 'Internship Profile' : 'Job Profile'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Capture all details regarding the role, designation, and primary operations surrounding the candidate's responsibilities.
        </Typography>
      </Box>

      {/* BASIC DETAILS GROUP */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Job Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="profile_name"
                control={control}
                rules={{ required: 'Job Title is required', maxLength: 255 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Profile Name / Job Title *"
                    placeholder="e.g. Software Development Engineer"
                    fullWidth
                    error={!!errors.profile_name}
                    helperText={errors.profile_name?.message || `${field.value.length}/255`}
                    FormHelperTextProps={{ sx: { textAlign: errors.profile_name ? 'left' : 'right' } }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="designation"
                control={control}
                rules={{ maxLength: 255 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job Designation"
                    placeholder="e.g. Engineer Grade-1"
                    fullWidth
                    error={!!errors.designation}
                    helperText={errors.designation?.message || "Formal designation as per offer letter (may differ from job title)"}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="place_of_posting"
                control={control}
                rules={{ required: 'Place of posting is required', maxLength: 500 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Place of Posting *"
                    placeholder="e.g. Bangalore, Mumbai (Multiple locations)"
                    fullWidth
                    error={!!errors.place_of_posting}
                    helperText={errors.place_of_posting?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Work Location Mode *
              </Typography>
              <Controller
                name="work_mode"
                control={control}
                rules={{ required: 'Work location is required' }}
                render={({ field }) => (
                  <ToggleButtonGroup
                    value={field.value}
                    exclusive
                    onChange={(e, value) => { if (value) field.onChange(value); }}
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="onsite" sx={{ py: 1.5 }}>
                      <WorkIcon sx={{ mr: 1, fontSize: 20 }} /> On-site
                    </ToggleButton>
                    <ToggleButton value="remote" sx={{ py: 1.5 }}>
                      <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> Remote
                    </ToggleButton>
                    <ToggleButton value="hybrid" sx={{ py: 1.5 }}>
                      <DevicesIcon sx={{ mr: 1, fontSize: 20 }} /> Hybrid
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              {errors.work_mode && <FormHelperText error>{errors.work_mode.message}</FormHelperText>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tentative Joining Month *
              </Typography>
              <Controller
                name="tentative_joining"
                control={control}
                rules={{ required: 'Joining month is required' }}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['month', 'year']}
                      onChange={(date: Dayjs | null) => {
                        field.onChange(date ? date.format('YYYY-MM') : null);
                      }}
                      value={field.value ? dayjs(field.value) : null}
                      minDate={dayjs()}
                      sx={{ width: '100%' }}
                      slotProps={{
                        textField: {
                          error: !!errors.tentative_joining,
                          helperText: errors.tentative_joining?.message
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>

            {/* Expected Hires and Minimum Hires */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="expected_hires"
                    control={control}
                    rules={{ 
                      required: 'Required', 
                      min: { value: 1, message: 'Min 1' } 
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Expected Hires *"
                        fullWidth
                        error={!!errors.expected_hires}
                        helperText={errors.expected_hires?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="min_hires"
                    control={control}
                    rules={{ 
                      min: { value: 1, message: 'Min 1' },
                      validate: (v) => !v || !formValues.expected_hires || Number(v) <= Number(formValues.expected_hires) || 'Cannot exceed expected hires'
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Minimum Hires"
                        fullWidth
                        error={!!errors.min_hires}
                        helperText={errors.min_hires?.message || "Minimum acceptable number of hires"}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* SKILLS GROUP */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Required Skills
          </Typography>
          <TextField
            fullWidth
            label="Skills Tag Input"
            placeholder="Type a skill and press Enter or Comma (e.g. Python, React, SQL)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillInputKeyDown}
            disabled={formValues.skills.length >= 20}
            helperText={`${formValues.skills.length} / 20 limit`}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formValues.skills.map(skill => (
              <Chip
                key={skill}
                label={skill}
                onDelete={() => removeSkill(skill)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* JOB DESCRIPTION GROUP */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Job Description
            </Typography>
            <Controller
              name="use_pdf_for_jd"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Upload PDF instead of writing"
                />
              )}
            />
          </Box>

          {!formValues.use_pdf_for_jd ? (
            <Box>
              <Controller
                name="job_description"
                control={control}
                rules={{ required: !formValues.use_pdf_for_jd ? 'Job description is required' : false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ''}
                    label="Job Description"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    multiline
                    rows={8}
                    fullWidth
                    error={!!errors.job_description}
                    helperText={errors.job_description?.message}
                  />
                )}
              />
            </Box>
          ) : (
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 4, 
                textAlign: 'center',
                bgcolor: '#fafafa',
                cursor: 'pointer'
              }}
              component="label"
            >
               <input
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Click or drag & drop to upload JD PDF
              </Typography>
              <Typography variant="caption" color="text.secondary">
                application/pdf, Max 10MB
              </Typography>
              
              {formValues.jd_pdf_path && (
                <Box sx={{ mt: 3 }}>
                   <Chip 
                    label={jdFile ? `${jdFile.name} (${(jdFile.size / (1024 * 1024)).toFixed(2)} MB)` : formValues.jd_pdf_path} 
                    color="success" 
                    onDelete={() => {
                      setJdFile(null);
                      setValue('jd_pdf_path', '', { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                </Box>
              )}
              <Controller
                name="jd_pdf_path"
                control={control}
                rules={{ required: formValues.use_pdf_for_jd ? 'PDF Upload is required' : false }}
                render={({ field }) => (
                   errors.jd_pdf_path ? <FormHelperText error sx={{ mt: 2, textAlign: 'center' }}>{errors.jd_pdf_path.message}</FormHelperText> : <></>
                )}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* ADDITIONAL DETAILS GROUP */}
      <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Additional Information
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Controller
              name="ppo_provision"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Pre-Placement Offer (PPO) provision based on performance"
                />
              )}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="registration_link"
                control={control}
                rules={{ pattern: { value: /^https?:\/\//, message: 'Must be a valid URL starting with http:// or https://' } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Registration Link"
                    placeholder="https://"
                    fullWidth
                    error={!!errors.registration_link}
                    helperText={errors.registration_link?.message || "Company's own application link (if separate from CDC portal)"}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="additional_info"
                control={control}
                rules={{ maxLength: 1000 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Additional Job Info"
                    placeholder="Any other information about the role"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.additional_info}
                    helperText={errors.additional_info?.message || `${field.value?.length || 0}/1000`}
                    FormHelperTextProps={{ sx: { textAlign: errors.additional_info ? 'left' : 'right' } }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="bond_details"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bond Details"
                    placeholder="e.g. 2-year service bond with ₹2L penalty"
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="onboarding_procedure"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Onboarding Procedure"
                    placeholder="Describe the onboarding process if any"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
