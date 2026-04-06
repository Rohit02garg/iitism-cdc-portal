"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

export interface RecruiterDetailsData {
  full_name: string;
  designation: string;
  mobile: string;
  alt_mobile: string;
  password: string;
  password_confirmation: string;
}

interface RecruiterDetailsStepProps {
  onComplete: (data: RecruiterDetailsData) => void;
  onBack: () => void;
  defaultValues?: Partial<RecruiterDetailsData>;
}

export default function RecruiterDetailsStep({
  onComplete,
  onBack,
  defaultValues,
}: RecruiterDetailsStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RecruiterDetailsData>({
    defaultValues: {
      full_name: defaultValues?.full_name || '',
      designation: defaultValues?.designation || '',
      mobile: defaultValues?.mobile || '',
      alt_mobile: defaultValues?.alt_mobile || '',
      password: defaultValues?.password || '',
      password_confirmation: defaultValues?.password_confirmation || '',
    },
    mode: 'onChange',
  });

  const password = watch('password');

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length === 0) return { label: '', value: 0, color: 'inherit' as const };
    
    if (/(?=.*[a-z])/.test(pass)) strength += 1;
    if (/(?=.*[A-Z])/.test(pass)) strength += 1;
    if (/(?=.*\d)/.test(pass)) strength += 1;
    if (/(?=.*[@$!%*?&])/.test(pass)) strength += 1;

    if (pass.length < 8) strength = Math.min(strength, 2);

    if (strength < 3) return { label: 'Weak', value: 33, color: 'error' as const };
    if (strength === 3) return { label: 'Fair', value: 66, color: 'warning' as const };
    return { label: 'Strong', value: 100, color: 'success' as const };
  };

  const strengthInfo = getPasswordStrength(password || '');

  const onSubmit = (data: RecruiterDetailsData) => {
    onComplete(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Recruiter Details
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Please provide the contact details for the primary point of contact.
      </Typography>

      <Grid container spacing={3}>
        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <Controller
            name="full_name"
            control={control}
            rules={{
              required: 'Full name is required',
              minLength: { value: 2, message: 'Minimum 2 characters required' },
              maxLength: { value: 255, message: 'Maximum 255 characters allowed' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                fullWidth
                error={!!errors.full_name}
                helperText={errors.full_name?.message || `${field.value.length}/255`}
                FormHelperTextProps={{ sx: { textAlign: errors.full_name ? 'left' : 'right' } }}
              />
            )}
          />
        </Grid>

        {/* Designation */}
        <Grid item xs={12} md={6}>
          <Controller
            name="designation"
            control={control}
            rules={{
              required: 'Designation is required',
              maxLength: { value: 255, message: 'Maximum 255 characters allowed' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Designation"
                placeholder="e.g. HR Manager"
                fullWidth
                error={!!errors.designation}
                helperText={errors.designation?.message || `${field.value.length}/255`}
                FormHelperTextProps={{ sx: { textAlign: errors.designation ? 'left' : 'right' } }}
              />
            )}
          />
        </Grid>

        {/* Contact Number */}
        <Grid item xs={12} md={6}>
          <Controller
            name="mobile"
            control={control}
            rules={{
              required: 'Contact number is required',
              pattern: { value: /^[6-9]\d{9}$/, message: 'Must be a valid 10-digit mobile number starting with 6, 7, 8, or 9' },
            }}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) onChange(val);
                }}
                label="Contact Number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91 </InputAdornment>,
                }}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            )}
          />
        </Grid>

        {/* Alternative Mobile */}
        <Grid item xs={12} md={6}>
          <Controller
            name="alt_mobile"
            control={control}
            rules={{
              validate: (val) => !val || /^[6-9]\d{9}$/.test(val) || 'Must be a valid 10-digit mobile number starting with 6, 7, 8, or 9',
            }}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) onChange(val);
                }}
                label="Alternative Mobile (Optional)"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91 </InputAdornment>,
                }}
                error={!!errors.alt_mobile}
                helperText={errors.alt_mobile?.message}
              />
            )}
          />
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={6}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
              validate: (val) => {
                const criteria = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(val);
                return criteria || 'Must contain uppercase, lowercase, number, and special character';
              }
            }}
            render={({ field }) => (
              <Box>
                <TextField
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                {field.value && (
                  <Box sx={{ mt: 1, px: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={strengthInfo.value}
                      color={strengthInfo.color}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: `${strengthInfo.color}.main` }}>
                      Strength: {strengthInfo.label}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          />
        </Grid>

        {/* Confirm Password */}
        <Grid item xs={12} md={6}>
          <Controller
            name="password_confirmation"
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: (val) => val === password || 'Passwords do not match',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
        <Button variant="outlined" onClick={onBack} sx={{ minWidth: 120 }}>
          Back
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 200 }}>
          Next: Company Profile
        </Button>
      </Box>
    </Box>
  );
}
