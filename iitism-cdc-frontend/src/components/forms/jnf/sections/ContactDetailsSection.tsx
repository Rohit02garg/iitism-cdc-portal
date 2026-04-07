'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Collapse,
  IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

export interface ContactPerson {
  full_name: string;
  designation: string;
  email: string;
  mobile: string;
  alt_mobile?: string;
  landline?: string;
}

export interface ContactForm {
  head_hr: ContactPerson;
  poc_1: ContactPerson;
  poc_2: Partial<ContactPerson>;
}

interface ContactDetailsSectionProps {
  jnfId: number;
  initialData?: ContactForm;
  onSave: (section: string, data: object) => Promise<void>;
  onComplete: (isComplete: boolean) => void;
}

export default function ContactDetailsSection({
  jnfId,
  initialData,
  onSave,
  onComplete
}: ContactDetailsSectionProps) {

  const [poc2Expanded, setPoc2Expanded] = useState(false);

  const { control, watch, setValue, getValues, formState: { errors } } = useForm<ContactForm>({
    defaultValues: {
      head_hr: initialData?.head_hr || { full_name: '', designation: '', email: '', mobile: '', alt_mobile: '', landline: '' },
      poc_1: initialData?.poc_1 || { full_name: '', designation: '', email: '', mobile: '', alt_mobile: '', landline: '' },
      poc_2: initialData?.poc_2 || { full_name: '', designation: '', email: '', mobile: '', alt_mobile: '', landline: '' }
    },
    mode: 'onChange'
  });

  const formValues = watch();

  // Refs for unmount save
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Save immediately on unmount (prevents data loss on fast tab switches)
  useEffect(() => {
    return () => {
      onSaveRef.current('contacts', formValuesRef.current);
    };
  }, []);

  useEffect(() => {
    // Check completion criteria: head_hr and poc_1 required fields filled
    const checkIsComplete = () => {
      const isHeadHrValid = !!(formValues.head_hr?.full_name && formValues.head_hr?.designation && formValues.head_hr?.email && formValues.head_hr?.mobile && !errors.head_hr);
      const isPoc1Valid = !!(formValues.poc_1?.full_name && formValues.poc_1?.designation && formValues.poc_1?.email && formValues.poc_1?.mobile && !errors.poc_1);
      return isHeadHrValid && isPoc1Valid;
    };

    onComplete(checkIsComplete());
    
    // Setup debounced autosave behavior hook
    const timeout = setTimeout(() => {
      onSave('contacts', formValues);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [formValues, onComplete, onSave, errors]);

  const copyFromHeadHr = () => {
    const hr = getValues('head_hr');
    setValue('poc_1.full_name', hr.full_name, { shouldValidate: true });
    setValue('poc_1.designation', hr.designation, { shouldValidate: true });
    setValue('poc_1.email', hr.email, { shouldValidate: true });
    setValue('poc_1.mobile', hr.mobile, { shouldValidate: true });
    setValue('poc_1.alt_mobile', hr.alt_mobile || '', { shouldValidate: true });
    setValue('poc_1.landline', hr.landline || '', { shouldValidate: true });
  };

  const renderContactFields = (prefix: 'head_hr' | 'poc_1' | 'poc_2', required: boolean) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Controller
          name={`${prefix}.full_name` as const}
          control={control}
          rules={required ? { required: 'Full Name is required', maxLength: 255 } : { maxLength: 255 }}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Full Name ${required ? '*' : ''}`}
              fullWidth
              error={!!errors[prefix]?.full_name}
              helperText={errors[prefix]?.full_name?.message || `${field.value?.length || 0}/255`}
              FormHelperTextProps={{ sx: { textAlign: 'right' } }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`${prefix}.designation` as const}
          control={control}
          rules={required ? { required: 'Designation is required', maxLength: 255 } : { maxLength: 255 }}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Designation ${required ? '*' : ''}`}
              fullWidth
              error={!!errors[prefix]?.designation}
              helperText={errors[prefix]?.designation?.message || `${field.value?.length || 0}/255`}
              FormHelperTextProps={{ sx: { textAlign: 'right' } }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`${prefix}.email` as const}
          control={control}
          rules={required ? { 
            required: 'Email is required',
            pattern: { value: /.+@.+\..+/, message: 'Invalid email' }
          } : {
            pattern: { value: /.+@.+\..+/, message: 'Invalid email' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Email Address ${required ? '*' : ''}`}
              fullWidth
              error={!!errors[prefix]?.email}
              helperText={errors[prefix]?.email?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`${prefix}.mobile` as const}
          control={control}
          rules={required ? { 
            required: 'Mobile is required',
            pattern: { value: /^[6-9]\d{9}$/, message: '10-digit valid mobile' }
          } : {
            pattern: { value: /^[6-9]\d{9}$/, message: '10-digit valid mobile' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Mobile Number *`}
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">+91 </InputAdornment> }}
              error={!!errors[prefix]?.mobile}
              helperText={errors[prefix]?.mobile?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`${prefix}.alt_mobile` as const}
          control={control}
          rules={{
            pattern: { value: /^[6-9]\d{9}$/, message: '10-digit valid mobile' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ''}
              label="Alternative Mobile"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">+91 </InputAdornment> }}
              error={!!errors[prefix]?.alt_mobile}
              helperText={errors[prefix]?.alt_mobile?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`${prefix}.landline` as const}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ''}
              label="Landline (STD Code + Number)"
              fullWidth
              error={!!errors[prefix]?.landline}
              helperText={errors[prefix]?.landline?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Contact & HR Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please provide the primary communication contacts. The CDC will use these to coordinate procedures.
      </Typography>

      <Grid container spacing={3}>
        {/* Head HR */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>Head HR</Typography>
                <Chip label="REQUIRED" size="small" color="error" variant="outlined" sx={{ fontWeight: 'bold' }} />
              </Box>
              {renderContactFields('head_hr', true)}
            </CardContent>
          </Card>
        </Grid>

        {/* PoC 1 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Primary Contact (PoC 1)</Typography>
                <Chip label="REQUIRED" size="small" color="error" variant="outlined" sx={{ fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button size="small" onClick={copyFromHeadHr} sx={{ textTransform: 'none' }}>
                  Copy from Head HR &darr;
                </Button>
              </Box>
              {renderContactFields('poc_1', true)}
            </CardContent>
          </Card>
        </Grid>

        {/* PoC 2 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: { xs: 1, md: 2 }, borderRadius: 2, bgcolor: poc2Expanded ? '#ffffff' : '#f8f9fa' }}>
            <CardContent>
              <Box 
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setPoc2Expanded(!poc2Expanded)}
              >
                <Typography variant="h6" fontWeight={600} color={poc2Expanded ? 'text.primary' : 'text.secondary'}>
                  Secondary Contact (PoC 2)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="OPTIONAL" size="small" color="default" variant="outlined" />
                  <IconButton size="small">
                    {poc2Expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </Box>
              </Box>
              <Collapse in={poc2Expanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 3 }}>
                  {renderContactFields('poc_2', false)}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
