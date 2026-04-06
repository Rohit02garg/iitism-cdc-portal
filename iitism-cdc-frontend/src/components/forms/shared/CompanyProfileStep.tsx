"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { ORG_TYPES, SECTORS } from '@/lib/constants';

export interface CompanyProfileData {
  company_name: string;
  org_type: string;
  website: string;
  sector: string;
  nature_of_business: string;
  postal_address: string;
  date_of_establishment: string | null;
  annual_turnover: string;
  no_of_employees: string;
  industry_tags: string[];
  hq_country: string;
  hq_city: string;
  social_media_url: string;
  description: string;
  logo: File | null;
}

interface CompanyProfileStepProps {
  onComplete: (data: CompanyProfileData) => void;
  onBack: () => void;
  defaultValues?: Partial<CompanyProfileData>;
  isSubmitting?: boolean;
}

export default function CompanyProfileStep({
  onComplete,
  onBack,
  defaultValues,
  isSubmitting = false,
}: CompanyProfileStepProps) {
  const [tagInput, setTagInput] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CompanyProfileData>({
    defaultValues: {
      company_name: defaultValues?.company_name || '',
      org_type: defaultValues?.org_type || '',
      website: defaultValues?.website || '',
      sector: defaultValues?.sector || '',
      nature_of_business: defaultValues?.nature_of_business || '',
      postal_address: defaultValues?.postal_address || '',
      date_of_establishment: defaultValues?.date_of_establishment || null,
      annual_turnover: defaultValues?.annual_turnover || '',
      no_of_employees: defaultValues?.no_of_employees || '',
      industry_tags: defaultValues?.industry_tags || [],
      hq_country: defaultValues?.hq_country || '',
      hq_city: defaultValues?.hq_city || '',
      social_media_url: defaultValues?.social_media_url || '',
      description: defaultValues?.description || '',
      logo: defaultValues?.logo || null,
    },
    mode: 'onChange',
  });

  const orgType = watch('org_type');
  const industryTags = watch('industry_tags');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !industryTags.includes(newTag)) {
        if (industryTags.length >= 10) {
          setError('industry_tags', { type: 'manual', message: 'Maximum 10 tags allowed' });
        } else {
          setValue('industry_tags', [...industryTags, newTag], { shouldValidate: true });
          setTagInput('');
          clearErrors('industry_tags');
        }
      }
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setValue(
      'industry_tags',
      industryTags.filter((tag) => tag !== tagToDelete),
      { shouldValidate: true }
    );
    if (industryTags.length <= 10) clearErrors('industry_tags');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('logo', { type: 'manual', message: 'Logo file size must not exceed 2MB' });
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('logo', { type: 'manual', message: 'Only JPEG and PNG formats are allowed' });
        return;
      }
      clearErrors('logo');
      setValue('logo', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitForm = (data: CompanyProfileData) => {
    onComplete(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Company Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Provide the foundational details of your organization.
        </Typography>

        <Grid container spacing={3}>
          {/* Company Name */}
          <Grid item xs={12}>
            <Controller
              name="company_name"
              control={control}
              rules={{
                required: 'Company Name is required',
                maxLength: { value: 255, message: 'Max 255 characters' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company Name"
                  fullWidth
                  error={!!errors.company_name}
                  helperText={errors.company_name?.message || `${field.value.length}/255`}
                  FormHelperTextProps={{ sx: { textAlign: errors.company_name ? 'left' : 'right' } }}
                />
              )}
            />
          </Grid>

          {/* Org Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.org_type}>
              <InputLabel>Organisation Type</InputLabel>
              <Controller
                name="org_type"
                control={control}
                rules={{ required: 'Organisation Type is required' }}
                render={({ field }) => (
                  <Select {...field} label="Organisation Type">
                    {ORG_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.org_type && <FormHelperText>{errors.org_type.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Sector */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.sector}>
              <InputLabel>Sector</InputLabel>
              <Controller
                name="sector"
                control={control}
                rules={{ required: 'Sector is required' }}
                render={({ field }) => (
                  <Select {...field} label="Sector">
                    {SECTORS.map((sector) => (
                      <MenuItem key={sector} value={sector}>
                        {sector}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.sector && <FormHelperText>{errors.sector.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* MNC Conditional Fields */}
          {orgType === 'MNC' && (
            <>
              <Grid item xs={12} md={6}>
                <Controller
                  name="hq_country"
                  control={control}
                  rules={{ required: 'HQ Country is required for MNC' }}
                  render={({ field }) => (
                    <TextField {...field} label="HQ Country" fullWidth error={!!errors.hq_country} helperText={errors.hq_country?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="hq_city"
                  control={control}
                  rules={{ required: 'HQ City is required for MNC' }}
                  render={({ field }) => (
                    <TextField {...field} label="HQ City" fullWidth error={!!errors.hq_city} helperText={errors.hq_city?.message} />
                  )}
                />
              </Grid>
            </>
          )}

          {/* Website */}
          <Grid item xs={12} md={6}>
            <Controller
              name="website"
              control={control}
              rules={{
                pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL starting with http:// or https://' },
              }}
              render={({ field }) => (
                <TextField {...field} label="Website (Optional)" placeholder="https://" fullWidth error={!!errors.website} helperText={errors.website?.message} />
              )}
            />
          </Grid>

          {/* Date of Establishment */}
          <Grid item xs={12} md={6}>
            <Controller
              name="date_of_establishment"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Date of Establishment (Optional)"
                  views={['year', 'month']}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date: Dayjs | null) => field.onChange(date ? date.format('YYYY-MM-DD') : null)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              )}
            />
          </Grid>

          {/* Nature of Business */}
          <Grid item xs={12}>
            <Controller
              name="nature_of_business"
              control={control}
              rules={{ required: 'Nature of Business is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nature of Business"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.nature_of_business}
                  helperText={errors.nature_of_business?.message}
                />
              )}
            />
          </Grid>

          {/* Postal Address */}
          <Grid item xs={12}>
            <Controller
              name="postal_address"
              control={control}
              rules={{ required: 'Postal Address is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Postal Address"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.postal_address}
                  helperText={errors.postal_address?.message}
                />
              )}
            />
          </Grid>

          {/* Annual Turnover */}
          <Grid item xs={12} md={6}>
            <Controller
              name="annual_turnover"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Annual Turnover (Optional)" placeholder="e.g. ₹500 Crore" fullWidth />
              )}
            />
          </Grid>

          {/* Number of Employees */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Number of Employees (Optional)</InputLabel>
              <Controller
                name="no_of_employees"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Number of Employees (Optional)">
                    <MenuItem value=""><em>None Selected</em></MenuItem>
                    <MenuItem value="1-50">1-50</MenuItem>
                    <MenuItem value="51-200">51-200</MenuItem>
                    <MenuItem value="201-500">201-500</MenuItem>
                    <MenuItem value="501-1000">501-1000</MenuItem>
                    <MenuItem value="1001-5000">1001-5000</MenuItem>
                    <MenuItem value="5000+">5000+</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Industry Tags */}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Industry Tags (Optional, Max 10)
            </Typography>
            <TextField
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tags"
              fullWidth
              error={!!errors.industry_tags}
              helperText={errors.industry_tags?.message}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {industryTags.map((tag, index) => (
                <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} />
              ))}
            </Box>
          </Grid>

          {/* Social Media URL */}
          <Grid item xs={12} md={6}>
            <Controller
              name="social_media_url"
              control={control}
              rules={{
                pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL starting with http:// or https://' },
              }}
              render={({ field }) => (
                <TextField {...field} label="Social Media / LinkedIn URL (Optional)" placeholder="https://" fullWidth error={!!errors.social_media_url} helperText={errors.social_media_url?.message} />
              )}
            />
          </Grid>

          {/* Logo Upload */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <Button variant="outlined" component="label" sx={{ height: 56 }}>
                Upload Logo
                <input type="file" hidden accept="image/jpeg, image/png" onChange={handleLogoUpload} />
              </Button>
              {logoPreview && (
                <Box
                  component="img"
                  src={logoPreview}
                  alt="Logo Preview"
                  sx={{ width: 56, height: 56, objectFit: 'contain', border: '1px solid #ccc', borderRadius: 1 }}
                />
              )}
            </Box>
            {errors.logo && (
              <Typography variant="caption" color="error" sx={{ mt: 1, pl: 1, display: 'block' }}>
                {errors.logo.message}
              </Typography>
            )}
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ maxLength: { value: 500, message: 'Max 500 characters' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company Description (Optional)"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message || `${field.value.length}/500`}
                  FormHelperTextProps={{ sx: { textAlign: errors.description ? 'left' : 'right' } }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
          <Button variant="outlined" onClick={onBack} sx={{ minWidth: 120 }} disabled={isSubmitting}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 200 }} disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
